# Lekana

Lekana is an AI document-workflow platform: upload documents, run OCR and classification, route results, and export them to your own database. It's built from a visual workflow editor.

This is the **root repository**. Each service lives in its own repository and is included here as a **git submodule**. Every service deploys to **Vercel** as its own project, and one command (or one click in GitHub Actions) deploys all of them, already wired together.

## Services

| id | folder | what it does | deploy just this one |
|---|---|---|---|
| `upload` | [`lekana-ai-upload`](lekana-ai-upload) | File upload → Google Cloud Storage (encrypted) | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-upload&project-name=lekana-upload&env=ENCRYPTION_KEY%2CGCS_BUCKET_NAME%2CGOOGLE_SERVICE_ACCOUNT_JSON) |
| `ocr` | [`lekana-ai-ocr`](lekana-ai-ocr) | OCR: Document AI + Gemini | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-ocr&project-name=lekana-ocr&env=GEMINI_API_KEY) |
| `classification` | [`lekana-classification`](lekana-classification) | Document classification (Document AI + Gemini, MongoDB) | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-clasification&project-name=lekana-classification&env=MONGODB_URI%2CGEMINI_API_KEY) |
| `conditional-router` | [`lekana-ai-conditional-router`](lekana-ai-conditional-router) | Routes documents by label / confidence | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-conditional-router&project-name=lekana-conditional-router) |
| `db-export` | [`lekana-ai-db-export`](lekana-ai-db-export) | Exports extracted data to external databases | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-db-export&project-name=lekana-db-export&env=ENCRYPTION_KEY) |
| `workflow-builder` | [`lekana-ai-workflow-builder`](lekana-ai-workflow-builder) | Workflow editor API (Postgres / Prisma) | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-workflow-builder&project-name=lekana-workflow-builder&env=DATABASE_URL%2CGEMINI_API_KEY) |
| `runtime` | [`lekana-ai-runtime`](lekana-ai-runtime) | Executes published workflows (Postgres / Prisma) | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-runtime&project-name=lekana-runtime&env=DATABASE_URL) |
| `web` | [`lekana-ai-frontend`](lekana-ai-frontend) | SvelteKit web app (Clerk auth) | [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flekana-dev%2Flekana-ai-frontend&project-name=lekana-web&env=PUBLIC_CLERK_PUBLISHABLE_KEY%2CCLERK_SECRET_KEY) |

```
             ┌──────────── web (SvelteKit) ────────────┐
             │                                         │
     workflow-builder ◀──────────── runtime ──────────▶ upload
     (Postgres)          WORKFLOW_API   │  UPLOAD_SERVICE_URL
                                        │
                     Action.serviceUrl  ▼  (stored in the builder DB)
                ocr · classification · conditional-router · db-export
```

## Getting the code

```bash
git clone --recurse-submodules https://github.com/lekana-dev/lekana.git
cd lekana
# already cloned without submodules?
npm run setup          # git submodule update --init --recursive
npm run sync           # move every submodule to the latest commit on main
```

Each folder is a normal git repo. Commit and push service changes there, then commit the new submodule pointer here (`git add <folder> && git commit`). The *Update submodules* workflow can also do this for you.

## Deploy everything to Vercel

### Prerequisites (once)

1. A Vercel account, and a token from <https://vercel.com/account/tokens>.
2. The [Vercel GitHub app](https://github.com/apps/vercel) installed with access to this repo.
   With `--source services`, it also needs access to every service repo.
3. Backing services: Postgres (e.g. Neon) for the builder and runtime, MongoDB for classification, a GCP project with Document AI and a Cloud Storage bucket, plus Gemini and Clerk keys.
4. Fill in the environment:
   ```bash
   cp deploy/vercel.env.example deploy/vercel.env   # git-ignored
   ```

### Option A: one click in GitHub Actions

Add these repository secrets: `VERCEL_TOKEN`, `LEKANA_VERCEL_ENV` (the whole contents of `deploy/vercel.env`), and optionally `VERCEL_TEAM_ID`.
Then go to **Actions → Deploy to Vercel → Run workflow**.

### Option B: one command locally

```bash
export VERCEL_TOKEN=...          # PowerShell: $env:VERCEL_TOKEN="..."
npm run deploy:plan              # show what will happen
npm run deploy                   # do it
```

The script ([scripts/deploy-vercel.mjs](scripts/deploy-vercel.mjs), no dependencies) does the following for every service in [deploy/services.json](deploy/services.json):

1. **Creates or reuses a Vercel project** (`lekana-upload`, `lekana-ocr`, …). The project is Git-connected, so later pushes redeploy it automatically.
2. **Sets its environment variables.** These come from `[shared]` and from the service's own section of `deploy/vercel.env`.
3. **Wires services together.** Each service's production URL goes into the variables that need it: `WORKFLOW_API`, `UPLOAD_SERVICE_URL`, `WORKFLOW_BASE`, `RUNTIME_BASE` and `PUBLIC_API_URL`.
4. **Deploys in dependency order.** The six leaf services deploy in parallel, then `runtime`, then `web`.

Useful flags:

* `--only runtime,web` deploys a subset. Links to the other services still resolve.
* `--source services` builds each project from its own service repo, so a push there deploys straight away. The default, `--source root`, builds from this repo's submodules; that is the option to use on a fork.
* `--ref <branch>` deploys a different branch.

After the first deploy:

* **Run the database migrations once.** In each Prisma service folder, run `npx prisma migrate deploy` with `DATABASE_URL` set.
* **Point the workflow actions at the new URLs.** In the builder DB, set each `Action.serviceUrl` to the URLs the script prints for ocr, classification, conditional-router and db-export.

## How each service runs on Vercel

The API services are plain Express apps. Each one has:

* `api/index.js`: exports the Express app as a single Vercel Function. `vercel.json` rewrites every path to it.
* `vercel.json`: sets `framework: null`, Fluid compute, and a per-service `maxDuration`.
* `public/robots.txt`: makes the static output a near-empty folder, so source files are never served.

The same code still runs as a normal server with `npm start` or Docker. `app.listen()` is only called when the file is run directly.

The TypeScript services (`runtime`, `workflow-builder`, `classification`) compile to `dist/` during the Vercel build. The Prisma services build with `vercel-build: prisma generate && tsc`.

`runtime` starts workflow executions in the background, and `workflow-builder` sends emails in the background. Both use `waitUntil()` from `@vercel/functions`, so that work keeps running after the response is sent.

### Limits to know about

| limit | affects | notes |
|---|---|---|
| Request body ≤ **4.5 MB** | `upload`, runtime `run-with-files` | Larger files need direct-to-GCS uploads with signed URLs (not built yet), or Cloud Run for `upload`. |
| Function duration ≤ **300 s** (Hobby) / **800 s** (Pro) | `runtime`, `ocr`, `classification` | `runtime` used to allow 15 minutes on Cloud Run. On Pro, raise `maxDuration` in `vercel.json` to 800. |
| In-memory SSE | runtime `/workflows/:id/events` | Events only reach clients connected to the same instance. For reliable live updates, add a shared pub/sub (e.g. Upstash Redis) or poll the execution endpoints. |
| Private submodules | `--source root` | Vercel can only clone **public** submodules. Make the service repos public, or use `--source services`. |

## Local development

Each service has its own README with its setup and environment variables. Typical loop:

```bash
cd lekana-ai-ocr && cp .env.example .env && npm install && npm run dev
```

## License

[Apache-2.0](LICENSE)
