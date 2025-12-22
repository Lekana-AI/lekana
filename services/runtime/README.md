# Workflow Runtime Service

Runtime microservice for executing workflows published from the workflow-builder.

## Features

- **Workflow Execution**: Receives workflow JSON and executes nodes in topological order
- **Status Tracking**: Tracks execution status (pending, running, completed, failed)
- **Execution Logs**: Detailed logging for debugging and monitoring
- **Sample Actions**: Mock action endpoints for testing (upload, validate, api-call)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/runtime_db?schema=public"
PORT=3002
CLERK_DOMAIN=your-app.clerk.accounts.dev
```

### 3. Setup Database
```bash
npx prisma migrate dev --name init
```

### 4. Start the Service
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/publish` | Publish and execute workflow |
| GET | `/api/v1/executions` | List user's executions |
| GET | `/api/v1/executions/:id` | Get execution details |
| GET | `/api/v1/executions/:id/logs` | Get execution logs |
| POST | `/api/v1/actions/upload` | Sample upload action |
| POST | `/api/v1/actions/validate` | Sample validation action |
| POST | `/api/v1/actions/api-call` | Sample API call action |

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend       │────▶│  Runtime API     │────▶│  Action APIs     │
│   (Publish Btn)  │     │  (Port 3002)     │     │  (Sample/Real)   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                │
                                ▼
                         ┌──────────────────┐
                         │  PostgreSQL DB   │
                         │  (Executions,    │
                         │   Logs, Status)  │
                         └──────────────────┘
```

## Testing

Import `runtime-api.postman_collection.json` into Postman for API testing.
"# lekana-ai-runtime" 
