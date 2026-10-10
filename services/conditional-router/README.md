# Conditional Router

Stateless worker that filters what flows to the next node of a workflow, based on a field coming from an upstream node (classification label, OCR field, confidence, …).

- **Port:** `4010` (`PORT`)
- **Endpoints:** `GET /health`, `POST /api/v1/process` (standard [service contract](../../docs/architecture.md#service-contract))
- **Dependencies:** none

## Node configuration (`config`)

| Field | Default | Description |
|-------|---------|-------------|
| `routeByField` | `label` | Field on each upstream item to compare |
| `operator` | `equals` | `equals`, `not_equals`, `contains`, `greater_than`, `less_than` |
| `routeValue` | `""` | Value to compare against |
| `outputMode` | `documents_only` | `documents_only` (feed OCR), `filtered_data` (feed DB export), `full_data` |
| `skipIfEmpty` | `true` | Mark downstream nodes as skipped when nothing matches |

## Run

```bash
npm install && npm run dev          # http://localhost:4010
docker build -t lekana-conditional-router . && docker run -p 4010:4010 lekana-conditional-router
```

`cloudbuild.yaml` deploys it to Cloud Run as a private (IAM-only) service; see [docs/deploy-serverless.md](../../docs/deploy-serverless.md).
