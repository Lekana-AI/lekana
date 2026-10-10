# Deploy on a VM (single host, Docker Compose)

This guide runs the whole stack on one Linux server: databases, all 8 services, and Caddy for automatic HTTPS. It works on any provider (GCE, EC2, Azure, Hetzner, DigitalOcean, bare metal).

```
Internet ──443──► Caddy ─┬─► web:3000
                         └─► runtime:3002   (api.example.com)
        private network: workflow-builder, upload, classification, ocr,
                         db-export, conditional-router, postgres, mongo
```

## 1. Size the machine

| Load | vCPU | RAM | Disk |
|------|------|-----|------|
| Evaluation / small team | 2 | 4 GB | 30 GB SSD |
| Production, moderate volume | 4 | 8 GB | 50 GB+ SSD |

The heavy lifting (OCR, LLM calls) happens in Google's APIs, so CPU needs stay modest. The largest local process is the classification service (up to about 1 GB).

## 2. Prepare external services

You need these whether you self-host or not:

1. **Clerk**: create an application. Note the *Publishable key*, the *Secret key* and the *Frontend API* host (`CLERK_DOMAIN`). In Clerk, add your production domain.
2. **Gemini**: create an API key at <https://aistudio.google.com/app/apikey>.
3. **Google Cloud project**:
   - Create a Storage bucket with uniform access and public access prevention.
   - Enable Document AI, then create a **Form Parser** and an **Enterprise Document OCR** processor (and optionally a classifier) and note their IDs.
   - Create a service account with `Storage Object Admin` on the bucket and `Document AI API User`. Download a JSON key.
   - On a GCE VM you can attach this service account to the VM instead of using a key file. In that case remove the `secrets/gcp-service-account.json` volume lines from `docker-compose.yml`.

## 3. Install Docker

Ubuntu 22.04/24.04:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker
docker compose version     # must be v2.20+
```

## 4. DNS and firewall

- Create `A` (and `AAAA`) records for `APP_DOMAIN` (e.g. `app.example.com`) and `API_DOMAIN` (e.g. `api.example.com`) pointing at the VM.
- Allow inbound **22, 80 and 443** (TCP) and **443/udp** (HTTP/3). Block everything else. In particular, do **not** open 3000-4010, 5432 or 27017.

```bash
sudo ufw allow OpenSSH && sudo ufw allow 80,443/tcp && sudo ufw allow 443/udp && sudo ufw enable
```

> Docker publishes ports by editing iptables directly, and that bypasses ufw. The Compose file publishes only Caddy's ports, so keep it that way.

## 5. Configure

```bash
git clone https://github.com/Lekana-AI/lekana.git /opt/lekana && cd /opt/lekana
cp .env.example .env
chmod 600 .env
openssl rand -hex 32          # paste as ENCRYPTION_KEY
openssl rand -base64 24       # paste as POSTGRES_PASSWORD
nano .env                     # set domains, Clerk, Gemini, GCS, Document AI
mkdir -p secrets && chmod 700 secrets
cp /path/to/key.json secrets/gcp-service-account.json && chmod 600 secrets/gcp-service-account.json
```

Every variable is described in [configuration.md](configuration.md).

## 6. Start

```bash
docker compose up -d --build
docker compose ps                         # all services "running"/"healthy"; seed-actions "exited (0)"
docker compose logs -f runtime web        # watch startup
```

On first boot:

- Postgres creates the `workflow_builder` and `runtime` databases.
- workflow-builder applies its schema (`prisma db push`). The runtime applies its migrations (`prisma migrate deploy`).
- `seed-actions` registers the 5 built-in actions with internal URLs such as `http://ocr:4004`.
- Caddy obtains Let's Encrypt certificates for both domains. This takes a few seconds and requires DNS to resolve already.

Open `https://APP_DOMAIN`, sign in, and build a workflow.

### Smoke test

```bash
curl -s https://$API_DOMAIN/health
docker compose exec runtime wget -qO- http://ocr:4004/health      # workers reachable internally
curl -m 5 http://<vm-ip>:4004/health                              # must FAIL from outside
```

## 7. Operate

**Upgrade**

```bash
cd /opt/lekana && git pull
docker compose up -d --build          # rebuilds only changed services; migrations run on start
docker image prune -f
```

**Back up.** The state is in the `pgdata` and `mongodata` volumes and in your GCS bucket. Also back up `.env`, because without `ENCRYPTION_KEY` the stored documents cannot be decrypted.

```bash
docker compose exec -T postgres pg_dumpall -U lekana | gzip > backup-$(date +%F).sql.gz
docker compose exec -T mongo mongodump --archive --gzip > mongo-$(date +%F).archive.gz
```

Schedule both with cron and copy the files off the machine.

**Restore**

```bash
gunzip -c backup.sql.gz | docker compose exec -T postgres psql -U lekana -d postgres
docker compose exec -T mongo mongorestore --archive --gzip < mongo.archive.gz
```

**Logs**: `docker compose logs --since 1h <service>`. To ship logs, add a logging driver such as `gcplogs` or `awslogs`, or run a collector such as Vector or Promtail.

## 8. Variations

- **Managed databases.** To use Cloud SQL, RDS, Neon or Atlas instead of the bundled containers, delete the `postgres` and/or `mongo` services and hard-code `DATABASE_URL`, `WORKFLOW_DB_URL` and `MONGODB_URI` in `docker-compose.yml`. Use TLS (`?sslmode=require`).
- **Your own reverse proxy** (nginx, Traefik, a cloud load balancer). Remove `caddy` and publish `web:3000` and `runtime:3002` on `127.0.0.1` only. Proxy them with `X-Forwarded-Proto` set, and turn off response buffering for `/api/v1/workflows/*/events` (SSE).
- **Fewer services.** Each worker is optional. If you don't need DB export, delete `db-export` from the Compose file and remove its row from the `Action` table.
- **Scaling out.** Workers are stateless, so `docker compose up -d --scale ocr=3` works because Docker DNS round-robins between replicas. Beyond one host, move to the [serverless setup](deploy-serverless.md) or to Kubernetes with the same images.
- **Hybrid.** Run the core on a VM and point individual actions at Cloud Run workers by updating `Action.serviceUrl` (re-run `deploy/seed/actions.sql` with different `-v` values). Remember the security model: a public worker URL needs IAM or another auth layer in front of it.
