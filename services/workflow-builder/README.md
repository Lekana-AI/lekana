# Workflow Builder

Backend for the visual editor: workflows, nodes, edges, the action catalog, per-workflow roles and permissions, usage tracking, feedback emails, and AI-generated workflows (Gemini).

- **Port:** `3001` (`PORT`)
- **Database:** Postgres via Prisma (`prisma/schema.prisma`; the client is generated into `generated/prisma`)
- **Auth:** Clerk JWT on every route except `/health`
- **Config:** [`.env.example`](.env.example) and [docs/configuration.md](../../docs/configuration.md#workflow-builder-servicesworkflow-builder)

## Main routes

| Route | Purpose |
|-------|---------|
| `GET/POST /workflows`, `GET/PUT/DELETE /workflows/:id`, `POST /workflows/:id/duplicate` | Workflows |
| `POST /workflows/generate` | Generate a workflow from a natural-language prompt |
| `/workflows/:id/nodes[/:nodeId]`, `/workflows/:id/edges[/:edgeId]`, `/workflows/:id/fields` | Graph editing |
| `/workflows/:id/roles`, `GET /user/workflow-roles`, `GET /permissions/available` | Sharing and RBAC |
| `GET/POST /actions`, `PUT /actions/:id`, `/categories` | Action catalog (step types) |
| `/usage`, `/feedback`, `POST /utils/test-connection` | Usage metering, feedback, DB connection test |

`api-doc.pdf` and `workflow-builder-api.postman_collection.json` have request examples.

## Run

```bash
cp .env.example .env && npm install
npx prisma db push      # create or update the schema and generate the client
npm run dev
```

Seed the built-in actions with [`deploy/seed/actions.sql`](../../deploy/seed/actions.sql).
