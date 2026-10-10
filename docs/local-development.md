# Local development

Each service is a standalone Node.js project (there is no workspace tooling to learn). Run the services you are working on from source and leave the rest out, or run them in Docker.

## Requirements

- Node.js 20+ (the web app is tested on 22)
- Docker, for the databases
- Credentials as described in [configuration.md](configuration.md)

## 1. Start the databases

```bash
cp .env.example .env    # only POSTGRES_* and ENCRYPTION_KEY are needed for this step
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres mongo
```

Postgres is now on `localhost:5432` with the databases `workflow_builder` and `runtime`, and MongoDB is on `localhost:27017`.

## 2. Run the core services

Open one terminal per service:

```bash
# workflow-builder - http://localhost:3001
cd services/workflow-builder
cp .env.example .env && npm install
npx prisma db push          # also generates the Prisma client
npm run dev

# runtime - http://localhost:3002
cd services/runtime
cp .env.example .env && npm install
npx prisma migrate deploy && npx prisma generate
npm run dev

# web - http://localhost:5173
cd apps/web
cp .env.example .env && npm install
npm run dev
```

The `.env.example` defaults already point the services at each other on `localhost`.

## 3. Register actions

```bash
psql postgresql://lekana:<password>@localhost:5432/workflow_builder \
  -v upload_url=http://localhost:4001 -v classification_url=http://localhost:4002 \
  -v ocr_url=http://localhost:4004 -v db_export_url=http://localhost:4005 \
  -v conditional_router_url=http://localhost:4010 \
  -f deploy/seed/actions.sql
```

## 4. Run workers as needed

```bash
cd services/ocr && cp .env.example .env && npm install && npm run dev                # :4004
cd services/upload && cp .env.example .env && npm install && npm run dev             # :4001
cd services/classification && cp .env.example .env && npm install && npm run dev     # :4002
cd services/conditional-router && npm install && npm run dev                         # :4010
cd services/db-export && cp .env.example .env && npm install && npm run dev          # :4005
```

Or run a worker in Docker while you work on something else. Note that the workers' ports are not published in the base Compose file, so they are only reachable from other containers:

```bash
docker compose up -d --build conditional-router
```

Each worker has a Postman collection (`*.postman_collection.json`) for testing it directly.

## Useful commands

| Task | Command |
|------|---------|
| Type-check / build a TS service | `npm run build` |
| Web app checks | `cd apps/web && npm run check && npm run lint` |
| Inspect a database | `npx prisma studio` (in workflow-builder or runtime) |
| New runtime migration | `cd services/runtime && npx prisma migrate dev --name <change>` |
| History of one service | `git log --follow -- services/ocr` |
