#!/usr/bin/env bash
# Deploy every Lekana service to Google Cloud Run.
#
#   cp deploy/cloudrun/config.env.example deploy/cloudrun/config.env   # edit it
#   ./deploy/cloudrun/deploy.sh setup      # one-time: APIs, registry, service accounts
#   ./deploy/cloudrun/deploy.sh            # build, push, migrate, deploy (all services)
#   ./deploy/cloudrun/deploy.sh ocr web    # only the listed services
#
# Requires: gcloud (authenticated), docker. See docs/deploy-serverless.md.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck disable=SC1091
source deploy/cloudrun/config.env
: "${PROJECT_ID:?}" "${REGION:?}" "${CLERK_DOMAIN:?}" "${PUBLIC_CLERK_PUBLISHABLE_KEY:?}"

REPO="${ARTIFACT_REPO:-lekana}"
REGISTRY="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO"
TAG="${TAG:-$(git rev-parse --short HEAD)}"
RUNTIME_SA="lekana-runtime@$PROJECT_ID.iam.gserviceaccount.com"
WORKER_SA="lekana-worker@$PROJECT_ID.iam.gserviceaccount.com"
WORKERS=(upload classification ocr db-export conditional-router)
GC=(gcloud --project "$PROJECT_ID" --quiet)

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

setup() {
  log "Enabling APIs"
  "${GC[@]}" services enable run.googleapis.com artifactregistry.googleapis.com \
    secretmanager.googleapis.com iamcredentials.googleapis.com documentai.googleapis.com \
    storage.googleapis.com sqladmin.googleapis.com

  log "Artifact Registry repository $REPO"
  "${GC[@]}" artifacts repositories describe "$REPO" --location "$REGION" >/dev/null 2>&1 ||
    "${GC[@]}" artifacts repositories create "$REPO" --location "$REGION" --repository-format docker
  gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet

  log "Service accounts"
  for sa in lekana-runtime lekana-worker; do
    "${GC[@]}" iam service-accounts describe "$sa@$PROJECT_ID.iam.gserviceaccount.com" >/dev/null 2>&1 ||
      "${GC[@]}" iam service-accounts create "$sa" --display-name "Lekana $sa"
  done
  for sa in "$RUNTIME_SA" "$WORKER_SA"; do
    "${GC[@]}" projects add-iam-policy-binding "$PROJECT_ID" --member "serviceAccount:$sa" \
      --role roles/secretmanager.secretAccessor --condition None >/dev/null
    if [[ -n "${CLOUDSQL_INSTANCE:-}" ]]; then
      "${GC[@]}" projects add-iam-policy-binding "$PROJECT_ID" --member "serviceAccount:$sa" \
        --role roles/cloudsql.client --condition None >/dev/null
    fi
  done
  "${GC[@]}" projects add-iam-policy-binding "$PROJECT_ID" --member "serviceAccount:$WORKER_SA" \
    --role roles/documentai.apiUser --condition None >/dev/null
  # Signed URLs without a key file: the worker signs blobs as itself via the IAM Credentials API
  "${GC[@]}" iam service-accounts add-iam-policy-binding "$WORKER_SA" \
    --member "serviceAccount:$WORKER_SA" --role roles/iam.serviceAccountTokenCreator >/dev/null
  if [[ -n "${GCS_BUCKET_NAME:-}" ]]; then
    gcloud storage buckets describe "gs://$GCS_BUCKET_NAME" --project "$PROJECT_ID" >/dev/null 2>&1 ||
      gcloud storage buckets create "gs://$GCS_BUCKET_NAME" --project "$PROJECT_ID" --location "$REGION" \
        --uniform-bucket-level-access --public-access-prevention
    gcloud storage buckets add-iam-policy-binding "gs://$GCS_BUCKET_NAME" \
      --member "serviceAccount:$WORKER_SA" --role roles/storage.objectAdmin >/dev/null
  fi

  log "Setup done. Now create the secrets listed in docs/deploy-serverless.md, then run: $0"
}

build() { # build <name> <context> [docker build args...]
  local name=$1 ctx=$2; shift 2
  log "Building $name"
  docker build --platform linux/amd64 -t "$REGISTRY/$name:$TAG" "$@" "$ctx"
  docker push "$REGISTRY/$name:$TAG"
}

url_of() { "${GC[@]}" run services describe "lekana-$1" --region "$REGION" --format 'value(status.url)'; }

sql_flags() { [[ -n "${CLOUDSQL_INSTANCE:-}" ]] && echo "--add-cloudsql-instances=$CLOUDSQL_INSTANCE" || true; }

deploy() { # deploy <name> <sa> <public|private> [gcloud run deploy flags...]
  local name=$1 sa=$2 access=$3; shift 3
  local auth=--no-allow-unauthenticated
  [[ $access == public ]] && auth=--allow-unauthenticated
  log "Deploying lekana-$name"
  # shellcheck disable=SC2046
  "${GC[@]}" run deploy "lekana-$name" --image "$REGISTRY/$name:$TAG" --region "$REGION" \
    --service-account "$sa" "$auth" $(sql_flags) "$@"
}

migrate() { # migrate <name> <secret for DATABASE_URL> <command...>
  local name=$1 secret=$2; shift 2
  local args; args=$(IFS=,; echo "${*:2}")
  log "Database migration for $name"
  # shellcheck disable=SC2046
  "${GC[@]}" run jobs deploy "lekana-$name-migrate" --image "$REGISTRY/$name:$TAG" --region "$REGION" \
    --service-account "$RUNTIME_SA" --set-secrets "DATABASE_URL=$secret:latest" $(sql_flags) \
    --command "$1" --args "$args" --max-retries 0
  "${GC[@]}" run jobs execute "lekana-$name-migrate" --region "$REGION" --wait
}

has() { [[ ${#TARGETS[@]} -eq 0 ]] || [[ " ${TARGETS[*]} " == *" $1 "* ]]; }

main() {
  TARGETS=("$@")
  gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet >/dev/null

  # ---- workers: private, invoked by the runtime with an IAM identity token
  if has upload; then
    build upload services/upload
    deploy upload "$WORKER_SA" private --memory 1Gi --timeout 600 \
      --set-env-vars "GCS_BUCKET_NAME=$GCS_BUCKET_NAME,CLERK_DOMAIN=$CLERK_DOMAIN" \
      --set-secrets "ENCRYPTION_KEY=lekana-encryption-key:latest"
  fi
  if has classification; then
    build classification services/classification
    deploy classification "$WORKER_SA" private --memory 2Gi --cpu 2 --timeout 300 \
      --set-env-vars "NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$DOCUMENT_AI_LOCATION,GOOGLE_CLOUD_PROCESSOR_ID=$DOCUMENT_AI_CLASSIFIER_PROCESSOR_ID" \
      --set-secrets "MONGODB_URI=lekana-mongodb-uri:latest,GEMINI_API_KEY=lekana-gemini-api-key:latest,ENCRYPTION_KEY=lekana-encryption-key:latest"
  fi
  if has ocr; then
    build ocr services/ocr
    deploy ocr "$WORKER_SA" private --memory 1Gi --timeout 600 \
      --set-env-vars "DOCUMENT_AI_PROJECT_ID=$PROJECT_ID,DOCUMENT_AI_LOCATION=$DOCUMENT_AI_LOCATION,DOCUMENT_AI_FORM_PARSER_ID=$DOCUMENT_AI_FORM_PARSER_ID,DOCUMENT_AI_OCR_PROCESSOR_ID=$DOCUMENT_AI_OCR_PROCESSOR_ID,CLERK_DOMAIN=$CLERK_DOMAIN" \
      --set-secrets "GEMINI_API_KEY=lekana-gemini-api-key:latest"
  fi
  if has db-export; then
    build db-export services/db-export
    deploy db-export "$WORKER_SA" private --memory 512Mi --timeout 300 \
      --set-env-vars "CLERK_DOMAIN=$CLERK_DOMAIN" \
      --set-secrets "GEMINI_API_KEY=lekana-gemini-api-key:latest,ENCRYPTION_KEY=lekana-encryption-key:latest"
  fi
  if has conditional-router; then
    build conditional-router services/conditional-router
    deploy conditional-router "$WORKER_SA" private --memory 256Mi
  fi

  # ---- workflow builder: public (Clerk JWT on every route)
  if has workflow-builder; then
    build workflow-builder services/workflow-builder
    migrate workflow-builder lekana-workflow-db-url npx prisma db push --skip-generate
    deploy workflow-builder "$RUNTIME_SA" public --memory 512Mi \
      --set-env-vars "CLERK_DOMAIN=$CLERK_DOMAIN" \
      --set-secrets "DATABASE_URL=lekana-workflow-db-url:latest,ENCRYPTION_KEY=lekana-encryption-key:latest,GEMINI_API_KEY=lekana-gemini-api-key:latest"
  fi

  # ---- runtime: public (Clerk JWT or workflow API key)
  if has runtime; then
    build runtime services/runtime
    migrate runtime lekana-runtime-db-url npx prisma migrate deploy
    deploy runtime "$RUNTIME_SA" public --memory 1Gi --timeout 900 \
      --set-env-vars "CLERK_DOMAIN=$CLERK_DOMAIN,WORKFLOW_API=$(url_of workflow-builder),UPLOAD_SERVICE_URL=$(url_of upload)" \
      --set-secrets "DATABASE_URL=lekana-runtime-db-url:latest,WORKFLOW_DB_URL=lekana-workflow-db-url:latest,ENCRYPTION_KEY=lekana-encryption-key:latest"
    for w in "${WORKERS[@]}"; do
      "${GC[@]}" run services add-iam-policy-binding "lekana-$w" --region "$REGION" \
        --member "serviceAccount:$RUNTIME_SA" --role roles/run.invoker >/dev/null
    done
  fi

  # ---- web: public. PUBLIC_* values are compiled into the bundle.
  if has web; then
    local api; api=$(url_of runtime)
    build web apps/web \
      --build-arg "PUBLIC_CLERK_PUBLISHABLE_KEY=$PUBLIC_CLERK_PUBLISHABLE_KEY" \
      --build-arg "PUBLIC_API_URL=$api" \
      --build-arg "PUBLIC_YOUTUBE_TUTORIAL_URL=${PUBLIC_YOUTUBE_TUTORIAL_URL:-}"
    local origin_env="PROTOCOL_HEADER=x-forwarded-proto"
    [[ -n "${WEB_ORIGIN:-}" ]] && origin_env="ORIGIN=$WEB_ORIGIN"
    deploy web "$RUNTIME_SA" public --memory 512Mi --timeout 900 \
      --set-env-vars "$origin_env,BODY_SIZE_LIMIT=50M,PUBLIC_CLERK_PUBLISHABLE_KEY=$PUBLIC_CLERK_PUBLISHABLE_KEY,PUBLIC_GA_MEASUREMENT_ID=${PUBLIC_GA_MEASUREMENT_ID:-},WORKFLOW_BASE=$(url_of workflow-builder),RUNTIME_BASE=$api" \
      --set-secrets "CLERK_SECRET_KEY=lekana-clerk-secret-key:latest"
  fi

  log "Deployed. Register the action service URLs once (and after a worker URL changes):"
  cat <<EOF
psql "<workflow-builder DATABASE_URL>" \\
  -v upload_url=$(url_of upload 2>/dev/null) \\
  -v classification_url=$(url_of classification 2>/dev/null) \\
  -v ocr_url=$(url_of ocr 2>/dev/null) \\
  -v db_export_url=$(url_of db-export 2>/dev/null) \\
  -v conditional_router_url=$(url_of conditional-router 2>/dev/null) \\
  -f deploy/seed/actions.sql

Web app: $(url_of web 2>/dev/null)
EOF
}

if [[ "${1:-}" == setup ]]; then setup; else main "$@"; fi
