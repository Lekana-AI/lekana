# Configuration reference

Every service is configured through environment variables only. Each directory has an `.env.example`; copy it to `.env` for local development. For Docker Compose, use the single root [`.env.example`](../.env.example): [`docker-compose.yml`](../docker-compose.yml) passes each service only the variables it needs and wires the internal URLs for you.

**Shared values.** These must be the same in every service that uses them:

| Variable | Used by | Notes |
|----------|---------|-------|
| `ENCRYPTION_KEY` | workflow-builder, runtime, upload, classification, db-export | 64 hex characters (`openssl rand -hex 32`). If you change it, existing encrypted data can no longer be read. |
| `CLERK_DOMAIN` | workflow-builder, runtime, upload, ocr, db-export | Clerk Frontend API host without `https://`, e.g. `your-app.clerk.accounts.dev` |
| `GEMINI_API_KEY` | workflow-builder, classification, ocr, db-export | Google AI Studio or Vertex key |

## web (`apps/web`)

| Variable | Required | When read | Description |
|----------|----------|-----------|-------------|
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | yes | **build time** | Clerk publishable key |
| `CLERK_SECRET_KEY` | yes | runtime | Clerk secret key (server side only) |
| `WORKFLOW_BASE` | yes | runtime | Internal URL of workflow-builder |
| `RUNTIME_BASE` | yes | runtime | Internal URL of runtime |
| `PUBLIC_API_URL` | yes | **build time** | Public URL of runtime, shown in the API docs and used by the "run" page |
| `ORIGIN` | yes for adapter-node | runtime | Public URL of the web app, e.g. `https://app.example.com`. Alternatively set `PROTOCOL_HEADER=x-forwarded-proto` behind a proxy. |
| `BODY_SIZE_LIMIT` | no | runtime | Max request body for the proxy, default `512K`; Compose sets `50M` |
| `PUBLIC_YOUTUBE_TUTORIAL_URL` | no | build time | Tutorial link in the support modal |
| `PUBLIC_GA_MEASUREMENT_ID` | no | runtime | Google Analytics 4 ID. If unset, no analytics script is loaded. |
| `ENTERPRISE_BASE`, `ENTERPRISE_TOKEN` | no | runtime | Upstream for the `/enterprise/*` proxy (enterprise booking form) |
| `SVELTE_ADAPTER` | no | build time | `node` builds a standalone Node server (Docker). If unset, adapter-auto targets Vercel, Netlify or Cloudflare. |

*Build time* means the value is compiled into the JavaScript bundle. When it changes, rebuild the image.

## workflow-builder (`services/workflow-builder`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | no | `3001` | |
| `DATABASE_URL` | yes | | Postgres connection string |
| `CLERK_DOMAIN` | yes | | |
| `ENCRYPTION_KEY` | yes | | |
| `GEMINI_API_KEY` | for AI builder | | |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | for email | port `587` | Port `465` switches to implicit TLS |
| `SUPPORT_EMAIL_FROM` | no | `SMTP_USER` | Sender address |
| `INTERNAL_NOTIFICATION_EMAILS` | no | | Comma-separated recipients for feedback notifications |
| `LOGO_URL` | no | lekana.dev logo | Logo in outgoing emails |

## runtime (`services/runtime`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | no | `3010` | Compose uses `3002` |
| `DATABASE_URL` | yes | | Runtime's own Postgres database |
| `WORKFLOW_DB_URL` | recommended | | workflow-builder's database, used to read current `Action.serviceUrl`. If unset, the URL saved when the workflow was published is used. |
| `WORKFLOW_API` | yes | `http://localhost:3001` | workflow-builder base URL |
| `UPLOAD_SERVICE_URL` | yes | `http://localhost:4001` | upload base URL (used for document download and decryption) |
| `CLERK_DOMAIN` | yes | | |
| `ENCRYPTION_KEY` | yes | | |
| `LOG_NEED` | no | `false` | Verbose logging of service calls |

## upload (`services/upload`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | no | `4001` | |
| `GCS_BUCKET_NAME` | yes | | |
| `GOOGLE_APPLICATION_CREDENTIALS` | off GCP | | Path to a service-account key. On Cloud Run or GCE the attached identity is used instead. |
| `SIGNED_URL_EXPIRY_MINUTES` | no | `60` | |
| `ENCRYPTION_KEY` | recommended | | If empty, files are stored unencrypted |
| `CLERK_DOMAIN` | for direct `/api/v1/upload` | | |

## classification (`services/classification`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | no | `4002` | |
| `MONGODB_URI` | yes | | |
| `GEMINI_API_KEY` | yes | | |
| `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_CLOUD_PROCESSOR_ID` | no | location `us` | Document AI classifier. Gemini is used when these are unset. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | no | | Inline key JSON (alternative to `GOOGLE_APPLICATION_CREDENTIALS`) |
| `CONFIDENCE_THRESHOLD` | no | `0.7` | Results below this are flagged for human review |
| `CORS_ORIGIN` | no | `*` | |
| `ENCRYPTION_KEY` | yes | | |
| `NODE_ENV`, `SERVICE_VERSION` | no | | |

## ocr (`services/ocr`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | no | `4004` | |
| `DOCUMENT_AI_PROJECT_ID` | yes | | |
| `DOCUMENT_AI_LOCATION` | no | `us` | |
| `DOCUMENT_AI_FORM_PARSER_ID` | yes | | Form Parser processor ID |
| `DOCUMENT_AI_OCR_PROCESSOR_ID` | yes | | Enterprise OCR processor ID |
| `GOOGLE_SERVICE_ACCOUNT_JSON` / `GOOGLE_APPLICATION_CREDENTIALS` | off GCP | | |
| `GEMINI_API_KEY` | yes | | |
| `CLERK_DOMAIN` | no | | |

## db-export (`services/db-export`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | no | `4005` | |
| `GEMINI_API_KEY` | for smart mapping | | |
| `ENCRYPTION_KEY` | yes | | Decrypts the user's saved connection strings |
| `CLERK_DOMAIN` | no | | |

## conditional-router (`services/conditional-router`)

| Variable | Required | Default |
|----------|----------|---------|
| `PORT` | no | `4010` |

On Cloud Run, `PORT` is always injected (`8080`), and every service honours it.
