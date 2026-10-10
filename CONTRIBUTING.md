# Contributing to Lekana

Thanks for helping! Bug reports, docs fixes, new actions (step types) and features are all welcome.

## Before you start

- For anything bigger than a small fix, **open an issue first** so the approach can be agreed before you write code.
- Read [docs/architecture.md](docs/architecture.md). Most changes touch only one service.
- Set up your environment with [docs/local-development.md](docs/local-development.md).

## Workflow

1. Fork the repository and create a branch from `main`: `feat/ocr-tables`, `fix/runtime-retry`, `docs/vm-backups`.
2. Keep the change inside one service or app where possible, and keep each PR to one topic.
3. Make sure it builds:
   ```bash
   cd services/<name> && npm ci && npm run build --if-present
   cd apps/web && npm ci && npm run check && npm run build
   ```
4. If you change a database schema:
   - **runtime**: add a migration with `npx prisma migrate dev --name <change>` and commit it.
   - **workflow-builder**: update `schema.prisma`. The change must be backwards compatible, because the schema is applied with `prisma db push`.
5. If you add or rename an environment variable, update the service's `.env.example`, [docs/configuration.md](docs/configuration.md), and `docker-compose.yml` / `deploy/cloudrun/deploy.sh` if it is needed in deployment.
6. Open a PR and fill in the template. CI must pass.

## Commit messages

Use the [Conventional Commits](https://www.conventionalcommits.org) style and scope the commit to the service:

```
feat(ocr): support multi-page TIFF
fix(runtime): stop retrying non-idempotent nodes
docs: add backup section to VM guide
```

## Adding a new action

1. Create `services/<your-action>/` with a `Dockerfile`, a `.env.example`, `GET /health` and `POST /api/v1/process`, following the service contract in [docs/architecture.md](docs/architecture.md#service-contract).
2. Add an `INSERT` for it to `deploy/seed/actions.sql`, including the `configSchema` defaults and the `configMeta` editor fields.
3. Add it to `docker-compose.yml`, `deploy/cloudrun/deploy.sh` and the CI matrix.

## Code style

Match the surrounding code. The web app uses Prettier and ESLint (`npm run lint`); the classification service uses ESLint.

## Licensing

By contributing, you agree that your contributions are licensed under the [Apache License 2.0](LICENSE).

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md).
