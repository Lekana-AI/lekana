# Security policy

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report them privately through **GitHub → Security → Report a vulnerability** on this repository, or by email to **support@lekana.dev** with "SECURITY" in the subject line.

Include the affected service, the steps to reproduce, and the impact. We aim to acknowledge reports within 3 working days and to agree on a disclosure timeline with you.

## Supported versions

Security fixes go into `main`. Self-hosters should track `main` or the latest release.

## Deployment hardening checklist

Most incidents come from the way Lekana is deployed, so please check:

- [ ] Worker services (`upload`, `ocr`, `classification`, `db-export`, `conditional-router`) are **not** reachable from the internet. They have no authentication of their own. See [docs/architecture.md § Security model](docs/architecture.md#security-model).
- [ ] `ENCRYPTION_KEY` is random (`openssl rand -hex 32`), is stored in a secret manager, and is backed up.
- [ ] `.env`, `secrets/` and service-account keys are never committed. On Cloud Run, prefer attached service accounts over key files.
- [ ] Database ports (5432, 27017) are not published publicly. Managed databases use TLS.
- [ ] The GCS bucket has public access prevention enabled.
- [ ] Your Clerk production instance is used in production, not a development instance.
