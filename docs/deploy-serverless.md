# Deploy serverless (Google Cloud Run)

Each service runs as its own Cloud Run service and scales to zero when idle. This is how Lekana runs in production. The script [`deploy/cloudrun/deploy.sh`](../deploy/cloudrun/deploy.sh) automates the steps below.

```
                      ┌─────────── public (own auth) ───────────┐
Internet ──► lekana-web ──► lekana-workflow-builder    lekana-runtime ◄── API clients
                                                              │  IAM identity token
                      ┌───────── private (--no-allow-unauthenticated) ─────────┐
                      lekana-upload  lekana-classification  lekana-ocr
                      lekana-db-export  lekana-conditional-router
```

| Service | Ingress auth | Service account | Memory / timeout |
|---------|--------------|-----------------|------------------|
| web | public | `lekana-runtime` | 512 Mi / 900 s |
| workflow-builder | public (Clerk JWT) | `lekana-runtime` | 512 Mi |
| runtime | public (Clerk JWT / API key) | `lekana-runtime` | 1 Gi / 900 s |
| upload, ocr | **IAM only** | `lekana-worker` | 1 Gi / 600 s |
| classification | **IAM only** | `lekana-worker` | 2 Gi, 2 vCPU |
| db-export, conditional-router | **IAM only** | `lekana-worker` | 512 Mi / 256 Mi |

The runtime detects `*.run.app` service URLs and attaches a Google-signed identity token for them. Granting `lekana-runtime` the `roles/run.invoker` role on each worker is the only wiring the workers need.

## 1. Prerequisites

- `gcloud` CLI, logged in (`gcloud auth login`) with Owner or Editor + IAM Admin on the project
- Docker, used to build and push images
- Clerk, Gemini and Document AI processors, as in [deploy-vm.md § 2](deploy-vm.md#2-prepare-external-services)

## 2. Databases

Cloud Run is stateless, so the databases have to run somewhere else:

| Need | Options |
|------|---------|
| Postgres × 2 databases (`workflow_builder`, `runtime`) | **Cloud SQL for Postgres** (set `CLOUDSQL_INSTANCE`; URLs look like `postgresql://user:pass@localhost/workflow_builder?host=/cloudsql/PROJECT:REGION:INSTANCE`), or Neon / Supabase (`?sslmode=require`) |
| MongoDB | MongoDB Atlas (allow Cloud Run egress, or use Atlas private endpoints with a VPC connector) |

Create both Postgres databases before you deploy.

## 3. One-time setup

```bash
cp deploy/cloudrun/config.env.example deploy/cloudrun/config.env   # edit it
./deploy/cloudrun/deploy.sh setup
```

`setup` enables the required APIs and creates the Artifact Registry repo. It also creates the `lekana-runtime` and `lekana-worker` service accounts and the bucket, and grants:

- `lekana-worker`: `documentai.apiUser`, `storage.objectAdmin` on the bucket, and `iam.serviceAccountTokenCreator` on itself (so upload can sign URLs without a key file)
- both accounts: `secretmanager.secretAccessor`, plus `cloudsql.client` when `CLOUDSQL_INSTANCE` is set

## 4. Secrets

Create these in Secret Manager. They are mounted as environment variables and never baked into images.

```bash
s() { printf '%s' "$2" | gcloud secrets create "$1" --data-file=- 2>/dev/null \
      || printf '%s' "$2" | gcloud secrets versions add "$1" --data-file=-; }

s lekana-encryption-key   "$(openssl rand -hex 32)"
s lekana-gemini-api-key   "AIza..."
s lekana-clerk-secret-key "sk_live_..."
s lekana-workflow-db-url  "postgresql://...workflow_builder..."
s lekana-runtime-db-url   "postgresql://...runtime..."
s lekana-mongodb-uri      "mongodb+srv://..."
```

## 5. Deploy

```bash
./deploy/cloudrun/deploy.sh                 # everything
./deploy/cloudrun/deploy.sh ocr runtime     # only some services
```

For each service the script builds a `linux/amd64` image tagged with the git SHA and pushes it to Artifact Registry. Schema changes run as a Cloud Run **Job** before the new revision is deployed: `prisma db push` for workflow-builder, `prisma migrate deploy` for runtime. The script then deploys in dependency order (workers → workflow-builder → runtime → web), wires the URLs between services, and grants the runtime invoker access to the workers.

## 6. Register the actions

At the end, the script prints a `psql … -f deploy/seed/actions.sql` command with your real worker URLs. Run it once against the workflow-builder database (through the Cloud SQL Auth Proxy, or directly for Neon/Supabase). Run it again whenever a worker URL changes. The runtime reads `serviceUrl` live, so already-published workflows follow the change.

## 7. Custom domains

Map your domains with a global external Application Load Balancer and serverless NEGs (recommended), or with `gcloud beta run domain-mappings create`. For example, `app.example.com` → `lekana-web` and `api.example.com` → `lekana-runtime`. Then set `WEB_ORIGIN=https://app.example.com` in `config.env` and redeploy `web`. To use `api.example.com` instead of the `run.app` URL in the API docs, redeploy `web` after changing the runtime URL. `PUBLIC_API_URL` is a build-time value.

Add the production domain in Clerk.

## 8. CI/CD

The recommended setup is GitHub Actions with **Workload Identity Federation**, so no JSON keys are stored in GitHub:

1. Create a deployer service account with `run.admin`, `artifactregistry.writer`, `iam.serviceAccountUser` on the two runtime SAs, and `secretmanager.viewer`.
2. Configure a WIF pool and provider for your GitHub repo (`google-github-actions/auth`).
3. In a workflow that runs on `main`, use `dorny/paths-filter` to work out which of `services/*` and `apps/web` changed. Then run `./deploy/cloudrun/deploy.sh <changed services>`, writing `config.env` from repository variables first.

The repo's [CI workflow](../.github/workflows/ci.yml) already builds every service on each PR.

## 9. Cost notes

- Everything scales to zero except the databases. Cloud SQL is the main fixed cost; Neon or Supabase can scale to zero as well.
- Set `--min-instances 1` on `runtime` and `web` if cold starts (about 2-5 s) matter more to you than about $10-20 per month.
- Executions can stream for minutes. The runtime's 900 s timeout bounds how long a single synchronous run can take.

## Other serverless and container platforms

The images are ordinary containers that listen on `$PORT`, so they run on AWS ECS Fargate or App Runner, Azure Container Apps, Fly.io, Railway, Render, and Kubernetes. Two things differ from Cloud Run:

1. **Worker auth.** The automatic identity token is Cloud Run specific. Put the workers on a **private network** that only the runtime can reach. Examples: ECS Service Connect or Cloud Map with security groups, Container Apps with internal ingress, Fly private `.internal` addresses, Kubernetes `ClusterIP` services with NetworkPolicies. Then set `Action.serviceUrl` to those internal addresses.
2. **Google credentials.** Outside GCP, supply `GOOGLE_SERVICE_ACCOUNT_JSON` (ocr, classification) or mount a key and set `GOOGLE_APPLICATION_CREDENTIALS` (upload), loaded from that platform's secret store.

The web app can also go to Vercel, Netlify or Cloudflare unchanged: leave `SVELTE_ADAPTER` unset so adapter-auto is used.
