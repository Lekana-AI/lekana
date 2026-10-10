# Runtime Service - Architecture & Scaling Guide

## Overview

The Runtime Service is a **workflow orchestrator** that:
1. **Stores** published workflow definitions
2. **Executes** workflows by calling external microservices
3. **Tracks** execution status and logs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RUNTIME SERVICE                                 │
│                           (Orchestrator - :3002)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐    │
│  │  API Routes      │────▶│  Engine Service  │────▶│  Service Client  │    │
│  │  (Express)       │     │  (Orchestrator)  │     │  (HTTP Client)   │    │
│  └──────────────────┘     └──────────────────┘     └────────┬─────────┘    │
│                                                              │               │
└──────────────────────────────────────────────────────────────┼───────────────┘
                                                               │
         ┌─────────────────────────────────────────────────────┴───────────────┐
         │                     EXTERNAL MICROSERVICES                          │
         ├─────────────────────────────────────────────────────────────────────┤
         │                                                                      │
         │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
         │  │ Upload  │  │ Classif │  │ Segment │  │   OCR   │  │ Validat │   │
         │  │ :4001   │  │ :4002   │  │ :4003   │  │ :4004   │  │ :4005   │   │
         │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
         │                                                                      │
         │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
         │  │ Summary │  │ Duplicat│  │ Human   │  │  Email  │                 │
         │  │ :4006   │  │ :4007   │  │ :4008   │  │ :4009   │                 │
         │  └─────────┘  └─────────┘  └─────────┘  └─────────┘                 │
         │                                                                      │
         └─────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
runtime/
├── prisma/
│   └── schema.prisma         # Database models
├── src/
│   ├── index.ts              # Entry point (port 3002)
│   ├── app.ts                # Express app setup
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT auth (Clerk)
│   │   └── apikey.middleware.ts  # API key auth
│   ├── controllers/
│   │   ├── workflow.controller.ts  # Publish, run, key management
│   │   └── execution.controller.ts # Execution status/logs
│   ├── services/
│   │   ├── engine.service.ts      # Workflow execution engine
│   │   └── service-client.ts      # ⭐ HTTP client for microservices
│   └── routes/
│       └── index.ts               # Route definitions
├── .env.example              # Environment variables template
└── package.json
```

---

## How It Works

### 1. Publishing a Workflow

```
Frontend → POST /api/v1/publish → Runtime
                                    │
                                    ├── Stores workflow definition in PublishedWorkflow table
                                    ├── Generates API key (hashed in ApiKey table)
                                    └── Returns API key to user (only shown once!)
```

### 2. Running a Workflow

```
External System → POST /workflows/:id/run → Runtime
   with X-API-Key                            │
                                             ├── Validates API key
                                             ├── Retrieves workflow definition
                                             ├── Executes via engine.service.ts
                                             │     │
                                             │     ├── Topological sort (determines node order)
                                             │     ├── For each node:
                                             │     │   ├── Build ServiceRequest
                                             │     │   ├── Call external microservice
                                             │     │   ├── Store ServiceResponse
                                             │     │   └── Update status
                                             │     └── Return execution ID
                                             └── Response with executionId
```

### 3. Service Communication

All microservices must follow the standard contract:

**Request (Runtime → Service)**:
```typescript
interface ServiceRequest {
  executionId: string;
  nodeId: string;
  workflowId: string;
  userId: string;
  input: { data?: any; documents?: DocumentRef[] };
  config: Record<string, any>;
  metadata?: { correlationId?: string; priority?: string };
}
```

**Response (Service → Runtime)**:
```typescript
interface ServiceResponse {
  success: boolean;
  data: any;
  documents?: DocumentRef[];
  metadata: { processingTime: number; serviceVersion: string };
  error?: { code: string; message: string; details?: any };
  requiresHumanReview?: boolean;
}
```

---

## Key Files

### `service-client.ts` - External Service Communication

This file handles all communication with external microservices:

```typescript
import { callService, ServiceRequest, ServiceResponse } from './service-client';

// Call any registered service
const response = await callService('upload', serviceRequest);
```

**Service Registry** (configured via environment variables):
| Service | Env Variable | Default |
|---------|--------------|---------|
| upload | `UPLOAD_SERVICE_URL` | http://localhost:4001 |
| classification | `CLASSIFICATION_SERVICE_URL` | http://localhost:4002 |
| segmentation | `SEGMENTATION_SERVICE_URL` | http://localhost:4003 |
| ocr | `OCR_SERVICE_URL` | http://localhost:4004 |
| validation | `VALIDATION_SERVICE_URL` | http://localhost:4005 |
| summarization | `SUMMARIZATION_SERVICE_URL` | http://localhost:4006 |
| duplication | `DUPLICATION_SERVICE_URL` | http://localhost:4007 |
| human-review | `HUMAN_REVIEW_SERVICE_URL` | http://localhost:4008 |
| email | `EMAIL_SERVICE_URL` | http://localhost:4009 |

### `engine.service.ts` - Workflow Execution

Main execution logic:
- `executeWorkflow()` - Execute workflow (called by old publish)
- `executeWorkflowWithInput()` - Execute with input data (called by /run endpoint)
- `topologicalSort()` - Determines execution order from edges
- `getNodeInput()` - Passes output from previous node
- `executeAction()` - Calls external microservice via service-client

---

## Database Models

```
┌─────────────────────┐
│  PublishedWorkflow  │
├─────────────────────┤
│ id                  │
│ workflowId (unique) │──────────────────┐
│ userId              │                  │
│ name                │                  │
│ definition (JSON)   │                  │
│ isActive            │                  │
└─────────────────────┘                  │
         │                               │
         │ 1:N                           │
         ▼                               │
┌─────────────────────┐                  │
│      ApiKey         │                  │
├─────────────────────┤                  │
│ id                  │                  │
│ key (hashed)        │                  │
│ keyPrefix           │                  │
│ name                │                  │
│ isActive            │                  │
│ lastUsedAt          │                  │
└─────────────────────┘                  │
                                         │
┌─────────────────────┐                  │
│ WorkflowExecution   │◀─────────────────┞
├─────────────────────┤
│ id                  │
│ workflowId          │
│ publishedWorkflowId │
│ userId              │
│ inputData (JSON)    │
│ status              │
│ startedAt/completedAt│
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│   NodeExecution     │
├─────────────────────┤
│ id                  │
│ nodeId              │
│ actionName          │
│ stepName            │
│ executionOrder      │
│ status              │
│ input/output (JSON) │
│ error               │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│   ExecutionLog      │
├─────────────────────┤
│ level (DEBUG/INFO/  │
│        WARN/ERROR)  │
│ message             │
│ metadata (JSON)     │
│ timestamp           │
└─────────────────────┘
```

---

## Environment Variables

See `.env.example` for all required variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Server
PORT=3002

# Auth
CLERK_DOMAIN=your-domain.clerk.accounts.dev

# Microservice URLs
UPLOAD_SERVICE_URL=http://localhost:4001
CLASSIFICATION_SERVICE_URL=http://localhost:4002
SEGMENTATION_SERVICE_URL=http://localhost:4003
OCR_SERVICE_URL=http://localhost:4004
VALIDATION_SERVICE_URL=http://localhost:4005
SUMMARIZATION_SERVICE_URL=http://localhost:4006
DUPLICATION_SERVICE_URL=http://localhost:4007
HUMAN_REVIEW_SERVICE_URL=http://localhost:4008
EMAIL_SERVICE_URL=http://localhost:4009
```

---

## Adding New Services

1. Add service config to `service-client.ts`:
```typescript
const SERVICES = {
  // ... existing
  'my-service': {
    url: process.env.MY_SERVICE_URL || 'http://localhost:4010',
    timeout: 30000,
    retries: 2
  }
};
```

2. Add action name aliases:
```typescript
const ACTION_SERVICE_MAP = {
  // ... existing
  'my action': 'my-service',
  'my-action': 'my-service'
};
```

3. Add environment variable to `.env.example`

4. Build the microservice following the standard contract

---

## Error Handling

When a microservice is unavailable or times out, the service client returns:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "upload service is not available at http://localhost:4001"
  }
}
```

The engine will mark the node as FAILED and stop execution.
