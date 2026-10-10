# Lekana

**Open-source, AI-powered document workflow automation.**

Lekana lets you design document-processing pipelines on a visual canvas: upload → classify → OCR / extract fields → route on conditions → export to a database. You can also have the AI build the pipeline for you. When a workflow is published it becomes an API endpoint that you call with an API key. Each step is a small, independent service, so you can add your own.

```
 Browser ──► web (SvelteKit) ──► workflow-builder ──► Postgres
                    │
                    └──────────► runtime ──► Postgres
                                   │
            ┌──────────┬───────────┼──────────────┬────────────────────┐
            ▼          ▼           ▼              ▼                    ▼
         upload  classification   ocr      conditional-router      db-export
          (GCS)  (DocAI+Gemini,  (DocAI+Gemini)                 (Postgres/MySQL/
                   MongoDB)                                       MongoDB targets)
```

## Repository layout

| Path | What it is | Stack | Default port |
|------|------------|-------|--------------|
| [`apps/web`](apps/web) | Web app, visual workflow editor, landing pages, API docs | SvelteKit 2, Svelte 5, Clerk | 3000 |
| [`services/workflow-builder`](services/workflow-builder) | Workflows, nodes, actions, roles, AI workflow generation | Express, Prisma, Postgres, Gemini | 3001 |
| [`services/runtime`](services/runtime) | Publishes and executes workflows, API keys, review queue, live events | Express, Prisma, Postgres | 3002 |
| [`services/upload`](services/upload) | File intake, zip extraction, encryption at rest, signed URLs | Express, Google Cloud Storage | 4001 |
| [`services/classification`](services/classification) | Document classification and auto-categorisation | Express, Document AI, Gemini, MongoDB | 4002 |
| [`services/ocr`](services/ocr) | OCR and field extraction | Express, Document AI, Gemini | 4004 |
| [`services/db-export`](services/db-export) | Export extracted data to an external database | Express, Knex, Mongoose, Gemini | 4005 |
| [`services/conditional-router`](services/conditional-router) | Route documents by label, field value or confidence | Express | 4010 |
| [`deploy/`](deploy) | Docker Compose, Caddy, Cloud Run script, seed data | | |
| [`docs/`](docs) | Architecture, configuration, deployment guides | | |

Each service is self-contained, with its own `package.json`, lockfile, `Dockerfile` and `.env.example`. You can build, test and deploy each one on its own.

## Quick start (everything on one machine)

Prerequisites: Docker with Compose v2, a [Clerk](https://clerk.com) application, a [Gemini API key](https://aistudio.google.com/app/apikey), and a Google Cloud project that has a Storage bucket and Document AI processors.

```bash
git clone https://github.com/Lekana-AI/lekana.git && cd lekana
cp .env.example .env                      # fill in the values
mkdir -p secrets && cp ~/Downloads/<key>.json secrets/gcp-service-account.json
docker compose up -d --build
```

Open <https://localhost>. Caddy serves a locally trusted certificate, which your browser may ask you to accept. The API is at <https://api.localhost>.

## Documentation

| Guide | Read this when you want to… |
|-------|-----------------------------|
| [Architecture](docs/architecture.md) | understand how the services talk to each other, the service contract, and the security model |
| [Configuration](docs/configuration.md) | look up every environment variable for every service |
| [Local development](docs/local-development.md) | run one or more services from source with hot reload |
| [Deploy on a VM](docs/deploy-vm.md) | self-host on a single server (any cloud or bare metal) with Docker Compose |
| [Deploy serverless](docs/deploy-serverless.md) | run each service on Google Cloud Run (or another container platform) |
| [Monorepo history](docs/monorepo-migration.md) | find code from the original per-service repositories |
| [Contributing](CONTRIBUTING.md) | send a pull request |
| [Security](SECURITY.md) | report a vulnerability |

## Project history

Until October 2026 Lekana lived in eight separate repositories. They were merged here with their **full commit history preserved**: `git log -- services/ocr` shows the OCR service's history back to its first commit. See [docs/monorepo-migration.md](docs/monorepo-migration.md).

## License

[Apache License 2.0](LICENSE). Copyright 2025-2026 The Lekana Authors.
