# Workflow Builder API Documentation

**Base URL**: `http://localhost:3001`  
**Version**: 1.0.0  
**Authentication**: Clerk JWT (Bearer Token)

---

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
   - [Categories](#categories)
   - [Actions](#actions)
   - [Workflows](#workflows)
   - [Nodes](#nodes)
   - [Edges](#edges)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)
5. [Frontend Integration Examples](#frontend-integration-examples)

---

## Authentication

All API endpoints (except the root `/` endpoint) require authentication using Clerk JWT tokens.

### Headers Required

```http
Authorization: Bearer <CLERK_JWT_TOKEN>
Content-Type: application/json
```

### Getting the Token (Frontend)

```typescript
import { useAuth } from '@clerk/clerk-react';

function YourComponent() {
  const { getToken } = useAuth();
  
  const fetchData = async () => {
    const token = await getToken();
    
    const response = await fetch('http://localhost:3001/workflows', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
  };
}
```

---

## API Endpoints

### Categories

#### Get All Categories

Retrieve all available workflow action categories.

```http
GET /categories
```

**Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Communication",
    "description": "Send emails, SMS, notifications",
    "actions": [
      {
        "id": "action-uuid",
        "name": "Send Email",
        "config": {
          "fields": [
            {
              "name": "to",
              "type": "string",
              "required": true,
              "label": "Recipient Email"
            },
            {
              "name": "subject",
              "type": "string",
              "required": true,
              "label": "Email Subject"
            }
          ]
        }
      }
    ]
  }
]
```

#### Get Specific Category

```http
GET /categories/:id
```

**Response**: `200 OK`

```json
{
  "id": "uuid",
  "name": "Communication",
  "description": "Send emails, SMS, notifications",
  "actions": [...]
}
```

---

### Actions

#### Get All Actions

Retrieve all available workflow actions.

```http
GET /actions
```

**Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Send Email",
    "categoryId": "category-uuid",
    "config": {
      "fields": [
        {
          "name": "to",
          "type": "string",
          "required": true,
          "label": "Recipient Email"
        },
        {
          "name": "subject",
          "type": "string",
          "required": true,
          "label": "Email Subject"
        },
        {
          "name": "body",
          "type": "text",
          "required": true,
          "label": "Email Body"
        }
      ]
    },
    "category": {
      "id": "uuid",
      "name": "Communication",
      "description": "Send emails, SMS, notifications"
    }
  }
]
```

#### Get Specific Action

```http
GET /actions/:id
```

**Response**: `200 OK`

```json
{
  "id": "uuid",
  "name": "Send Email",
  "categoryId": "category-uuid",
  "config": {...},
  "category": {...}
}
```

#### Get Actions by Category

```http
GET /actions/category/:categoryId
```

**Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Send Email",
    "config": {...}
  }
]
```

---

### Workflows

#### Get All Workflows

Retrieve all workflows for the authenticated user.

```http
GET /workflows
```

**Response**: `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Customer Onboarding Workflow",
    "createdAt": "2025-12-09T08:00:00.000Z",
    "updatedAt": "2025-12-09T08:00:00.000Z"
  }
]
```

#### Create Workflow

Create a new workflow.

```http
POST /workflows
```

**Request Body**:

```json
{
  "name": "My New Workflow"
}
```

**Response**: `201 Created`

```json
{
  "id": "new-uuid",
  "name": "My New Workflow",
  "createdAt": "2025-12-09T08:00:00.000Z",
  "updatedAt": "2025-12-09T08:00:00.000Z"
}
```

#### Get Specific Workflow

Retrieve a workflow with all its nodes and edges.

```http
GET /workflows/:id
```

**Response**: `200 OK`

```json
{
  "id": "uuid",
  "name": "Customer Onboarding Workflow",
  "createdAt": "2025-12-09T08:00:00.000Z",
  "updatedAt": "2025-12-09T08:00:00.000Z",
  "nodes": [
    {
      "id": "node-uuid-1",
      "workflowId": "workflow-uuid",
      "actionId": "action-uuid",
      "config": {
        "to": "customer@example.com",
        "subject": "Welcome!"
      },
      "positionX": 100,
      "positionY": 200,
      "action": {
        "id": "action-uuid",
        "name": "Send Email",
        "config": {...}
      }
    }
  ],
  "edges": [
    {
      "id": "edge-uuid",
      "workflowId": "workflow-uuid",
      "sourceNodeId": "node-uuid-1",
      "targetNodeId": "node-uuid-2"
    }
  ]
}
```

---

### Nodes

#### Add Node to Workflow

Add a new action node to a workflow.

```http
POST /workflows/:id/nodes
```

**Request Body**:

```json
{
  "actionId": "action-uuid",
  "config": {
    "to": "user@example.com",
    "subject": "Hello World",
    "body": "Welcome to our platform!"
  },
  "positionX": 250,
  "positionY": 150
}
```

**Response**: `201 Created`

```json
{
  "id": "new-node-uuid",
  "workflowId": "workflow-uuid",
  "actionId": "action-uuid",
  "config": {
    "to": "user@example.com",
    "subject": "Hello World",
    "body": "Welcome to our platform!"
  },
  "positionX": 250,
  "positionY": 150,
  "action": {
    "id": "action-uuid",
    "name": "Send Email",
    "config": {...},
    "category": {...}
  }
}
```

**Validation**: The API will verify that the `actionId` exists before creating the node.

---

### Edges

#### Add Edge to Workflow

Connect two nodes in a workflow.

```http
POST /workflows/:id/edges
```

**Request Body**:

```json
{
  "sourceNodeId": "node-uuid-1",
  "targetNodeId": "node-uuid-2"
}
```

**Response**: `201 Created`

```json
{
  "id": "new-edge-uuid",
  "workflowId": "workflow-uuid",
  "sourceNodeId": "node-uuid-1",
  "targetNodeId": "node-uuid-2"
}
```

**Validation**: The API will verify that both nodes exist before creating the edge.

---

## Data Models

### Workflow

```typescript
interface Workflow {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}
```

### WorkflowNode

```typescript
interface WorkflowNode {
  id: string;
  workflowId: string;
  actionId: string;
  config: Record<string, any>;  // Dynamic based on action
  positionX: number;
  positionY: number;
  action?: Action;
}
```

### WorkflowEdge

```typescript
interface WorkflowEdge {
  id: string;
  workflowId: string;
  sourceNodeId: string;
  targetNodeId: string;
}
```

### Action

```typescript
interface Action {
  id: string;
  name: string;
  categoryId: string;
  config: {
    fields: ActionField[];
  };
  category?: Category;
}

interface ActionField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'text' | 'email';
  required: boolean;
  label: string;
  defaultValue?: any;
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  description: string | null;
  actions?: Action[];
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Status Code | Meaning | Example |
|-------------|---------|---------|
| `200` | Success | Resource retrieved successfully |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Missing required fields |
| `401` | Unauthorized | Invalid or missing JWT token |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Internal server error |

### Example Error Responses

**400 Bad Request**:
```json
{
  "error": "actionId, positionX, and positionY are required"
}
```

**404 Not Found**:
```json
{
  "error": "Action not found"
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized"
}
```

---

## Frontend Integration Examples

### React + TypeScript Example

```typescript
// api/workflowApi.ts
import { useAuth } from '@clerk/clerk-react';

const BASE_URL = 'http://localhost:3001';

export const useWorkflowApi = () => {
  const { getToken } = useAuth();

  const getHeaders = async () => {
    const token = await getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  return {
    // Get all workflows
    getWorkflows: async () => {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/workflows`, { headers });
      if (!response.ok) throw new Error('Failed to fetch workflows');
      return response.json();
    },

    // Create workflow
    createWorkflow: async (name: string) => {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/workflows`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name })
      });
      if (!response.ok) throw new Error('Failed to create workflow');
      return response.json();
    },

    // Get workflow with nodes and edges
    getWorkflow: async (id: string) => {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/workflows/${id}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch workflow');
      return response.json();
    },

    // Add node to workflow
    addNode: async (workflowId: string, nodeData: {
      actionId: string;
      config: Record<string, any>;
      positionX: number;
      positionY: number;
    }) => {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/workflows/${workflowId}/nodes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(nodeData)
      });
      if (!response.ok) throw new Error('Failed to add node');
      return response.json();
    },

    // Add edge between nodes
    addEdge: async (workflowId: string, edgeData: {
      sourceNodeId: string;
      targetNodeId: string;
    }) => {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/workflows/${workflowId}/edges`, {
        method: 'POST',
        headers,
        body: JSON.stringify(edgeData)
      });
      if (!response.ok) throw new Error('Failed to add edge');
      return response.json();
    },

    // Get all categories
    getCategories: async () => {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/categories`, { headers });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },

    // Get all actions
    getActions: async () => {
      const headers = await getHeaders();
      const response = await fetch(`${BASE_URL}/actions`, { headers });
      if (!response.ok) throw new Error('Failed to fetch actions');
      return response.json();
    }
  };
};
```

### Usage in Component

```typescript
import React, { useEffect, useState } from 'react';
import { useWorkflowApi } from './api/workflowApi';

function WorkflowEditor() {
  const api = useWorkflowApi();
  const [workflow, setWorkflow] = useState(null);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load available actions
      const actionsData = await api.getActions();
      setActions(actionsData);

      // Load or create workflow
      const workflows = await api.getWorkflows();
      if (workflows.length > 0) {
        const detailedWorkflow = await api.getWorkflow(workflows[0].id);
        setWorkflow(detailedWorkflow);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAddNode = async (actionId: string, position: { x: number, y: number }) => {
    try {
      const newNode = await api.addNode(workflow.id, {
        actionId,
        config: {},
        positionX: position.x,
        positionY: position.y
      });
      
      // Update local state
      setWorkflow(prev => ({
        ...prev,
        nodes: [...prev.nodes, newNode]
      }));
    } catch (error) {
      console.error('Failed to add node:', error);
    }
  };

  const handleConnectNodes = async (sourceId: string, targetId: string) => {
    try {
      const newEdge = await api.addEdge(workflow.id, {
        sourceNodeId: sourceId,
        targetNodeId: targetId
      });
      
      // Update local state
      setWorkflow(prev => ({
        ...prev,
        edges: [...prev.edges, newEdge]
      }));
    } catch (error) {
      console.error('Failed to connect nodes:', error);
    }
  };

  return (
    <div>
      {/* Your workflow editor UI */}
    </div>
  );
}
```

---

## Notes for Frontend Developers

### Important Considerations

1. **Authentication**: Always include the Clerk JWT token in the Authorization header
2. **Error Handling**: Always handle network errors and API errors gracefully
3. **Loading States**: Show loading indicators while fetching data
4. **Validation**: Validate action configs before sending to ensure all required fields are present
5. **Real-time Updates**: Consider implementing WebSocket or polling for collaborative editing
6. **Optimistic Updates**: Update UI immediately and rollback on error for better UX

### Environment Variables

Create a `.env` file in your frontend project:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### CORS

The API has CORS enabled for all origins in development. For production, update the CORS configuration in `src/app.ts`.

---

## Support

For issues or questions:
- Backend Repository: [Link to your repo]
- API Issues: Create a GitHub issue
- Slack Channel: #workflow-builder-dev
