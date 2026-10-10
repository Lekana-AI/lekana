# Architecture

## Components

| Service | Responsibility | Owns data in | Called by |
|---------|----------------|--------------|-----------|
| **web** | UI, auth (Clerk), and a server-side proxy to the APIs | none | browsers |
| **workflow-builder** | CRUD for workflows, nodes, edges, actions and categories; per-workflow roles and permissions; usage; feedback email; AI workflow generation (Gemini) | Postgres `workflow_builder` | web, runtime |
| **runtime** | Publishes workflow snapshots, issues API keys, executes workflows, keeps execution logs, runs the human review queue, streams live events (SSE), serves documents | Postgres `runtime` (also reads `workflow_builder`) | web, external API clients |
| **upload** | Accepts files (single, bulk, zip), encrypts them with AES-256-GCM, stores them in GCS, issues signed URLs, decrypts on request | GCS bucket | runtime |
| **classification** | Labels documents (custom labels or automatic categories) with Document AI and Gemini | MongoDB | runtime |
| **ocr** | Extracts text and named fields: Document AI first, then Gemini refinement and validation | none | runtime |
| **conditional-router** | Passes documents downstream according to label, field value or confidence rules | none | runtime |
| **db-export** | Writes extracted data to a user-supplied Postgres, MySQL or MongoDB, with Gemini-assisted field mapping | none (target DB is the user's) | runtime |

## Request flows

### Designing a workflow

```
Browser ──(Clerk session)──► web  /api/*  ──(Bearer <Clerk JWT>)──► workflow-builder
```

The web app never exposes backend URLs to the browser for the editor. Its `/api/[...path]` route attaches the user's Clerk token and forwards the request to `WORKFLOW_BASE`.

### Publishing

`POST runtime /api/v1/publish` stores an immutable snapshot of the workflow graph (`PublishedWorkflow`). The user creates API keys with `POST /api/v1/workflows/:id/keys`. Keys are stored hashed and shown only once.

### Running

```
Client ──(X-API-Key or Clerk JWT)──► runtime /api/v1/workflows/:id/run[-with-files]
   runtime:
     1. topologically sorts the nodes
     2. for each node, looks up the Action's serviceUrl in the workflow-builder DB (WORKFLOW_DB_URL)
     3. POST <serviceUrl>/api/v1/process  with a ServiceRequest
     4. stores the ServiceResponse, then streams progress to subscribers over SSE
```

Because the runtime reads `Action.serviceUrl` at execution time, moving a service (for example from a VM to Cloud Run) only requires updating that column. Workflows that are already published pick up the new URL. [`deploy/seed/actions.sql`](../deploy/seed/actions.sql) sets these URLs.

### Service contract

Every worker implements `POST /api/v1/process` and `GET /health`.

```ts
// Request: runtime → service
interface ServiceRequest {
  executionId: string;
  nodeId: string;
  workflowId: string;
  userId: string;
  input: { data?: any; documents?: { url: string; filename: string; mimeType: string; size?: number }[] };
  config: Record<string, any>;          // the node's settings from the editor (Action.configSchema)
  metadata?: { correlationId?: string; priority?: 'low' | 'normal' | 'high' };
}

// Response: service → runtime
interface ServiceResponse {
  success: boolean;
  data: any;
  documents?: DocumentRef[];                 // documents passed to the next node
  metadata: { processingTime: number; serviceVersion: string; [k: string]: any };
  error?: { code: string; message: string; details?: any };
  requiresHumanReview?: boolean;             // pauses the run and creates a review task
  humanReviewData?: { type: 'ocr' | 'classification' | 'segmentation'; originalResult: any; confidence?: number };
}
```

The authoritative definition is in `services/runtime/src/services/service-client.ts`.

To **add a new step type**, write a service that implements this contract. Then insert an `Action` row with a `configSchema` (default values), a `configMeta` (how the editor renders each field) and the service's `serviceUrl`. Use [`deploy/seed/actions.sql`](../deploy/seed/actions.sql) as the template.

## Data stores

| Store | Used by | Notes |
|-------|---------|-------|
| Postgres `workflow_builder` | workflow-builder (read/write), runtime (read-only: `Action`) | Schema in `services/workflow-builder/prisma/schema.prisma`. There is no migration history yet, so the schema is applied with `prisma db push`. |
| Postgres `runtime` | runtime | Prisma migrations in `services/runtime/prisma/migrations`, applied with `prisma migrate deploy` |
| MongoDB | classification | Classification results and learned workflow categories |
| Google Cloud Storage | upload | Uploaded documents, encrypted when `ENCRYPTION_KEY` is set |

The two Postgres databases can live on one server, as they do in the Compose setup, or on separate servers.

## Security model

Read this before you deploy anywhere.

1. **User authentication.** Clerk issues RS256 JWTs. `workflow-builder` and `runtime` verify them against `https://$CLERK_DOMAIN/.well-known/jwks.json`. The runtime also accepts per-workflow API keys on the run endpoints.
2. **Workers do not authenticate requests themselves.** The `checkJwt` middleware on `/api/v1/process` is intentionally disabled in `upload`, `ocr`, `classification`, `conditional-router` and `db-export`, because their caller is the runtime and not a user. Each worker must therefore be reachable **only by the runtime**:
   - **VM / Compose:** workers sit on a private Docker network and publish no ports. Only Caddy (80/443) is exposed.
   - **Cloud Run:** workers are deployed with `--no-allow-unauthenticated`. The runtime's service account has `roles/run.invoker` on them, and the runtime attaches a Google identity token automatically to any `*.run.app` URL (see `services/runtime/src/services/service-client.ts`).
   - **Other platforms:** use private networking (an internal load balancer, a VPC or a service mesh). Never put a worker on a public URL without auth in front of it. An open `db-export` or `upload` lets anyone use your credentials and quota.
3. **Encryption at rest.** `ENCRYPTION_KEY` (32 bytes, hex) is shared by upload, runtime, workflow-builder, classification and db-export. It encrypts stored documents and the database connection strings that users save for db-export. If you lose or rotate it, existing data becomes unreadable.
4. **Secrets** come only from the environment. Nothing secret is committed; see the `.env.example` files.
