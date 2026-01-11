import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface WorkflowNodeSnapshot {
  tempId: string;
  actionName: string;
  config: any;
  position: { x: number; y: number };
}

export interface WorkflowEdgeSnapshot {
  sourceTempId: string;
  targetTempId: string;
}

export interface WorkflowSnapshot {
  name?: string;
  nodes: WorkflowNodeSnapshot[];
  edges: WorkflowEdgeSnapshot[];
}

/**
 * Streams the workflow generation process, including reasoning and final JSON.
 */
export async function* streamWorkflowGeneration(
  prompt: string,
  actions: any[],
  currentState?: WorkflowSnapshot
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: getSystemInstruction(actions)
  });

  const chat = model.startChat({
    history: getFewShotHistory(actions)
  });

  const userMessage = currentState
    ? `Current Workflow State: ${JSON.stringify(currentState, null, 2)}\n\nUser Request: ${prompt}`
    : `User Request: ${prompt}`;

  const result = await chat.sendMessageStream(userMessage);

  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

function getSystemInstruction(actions: any[]): string {
  const actionDocs = actions.map(a => ({
    name: a.name,
    description: a.description,
    configSchema: a.configSchema,
    inputType: a.inputType,
    outputType: a.outputType
  }));

  return `You are an expert AI Workflow Architect for "Lekana AI Workflow Builder".
Your goal is to help users build or refine automation workflows.

### RULES
1. **THINKING FIRST**: Always start by explaining your reasoning and plan.
2. **JSON OUTPUT**: After your explanation, provide a SINGLE JSON block containing the workflow configuration. Start the JSON block with the marker "---JSON_START---" and end it with "---JSON_END---".
3. **ONLY USE ACTIONS LISTED BELOW**: Do not invent new types of nodes.
4. **CONNECT COMPATIBLE NODES**: Use the inputType and outputType to ensure logical flow.
5. **LAYOUT**: Suggest reasonable X and Y positions for nodes to make the graph readable.
6. **REFINEMENT**: If a current state is provided, modify it according to the user request. Retain the existing tempIds where possible.
7. **PUBLISH WARNING**: If the user asks how to run/test the workflow, inform them that they must first **Publish** the workflow using the "Publish" button in the editor.
8. **UNSUPPORTED REQUESTS**: If the user asks for something that the current actions cannot perform, simply abort and apologize. If you cannot do what is asked, refuse and ask if they need help with anything you can do, and list a few examples (e.g., building a simple upload flow, connecting nodes, or refining existing steps).

### AVAILABLE ACTIONS
${JSON.stringify(actionDocs, null, 2)}

### JSON SCHEMA
{
  "name": "Workflow Name (optional)",
  "nodes": [
    {
      "tempId": "custom-unique-id",
      "actionName": "Action Name Exactly",
      "config": { /* must match action's configSchema */ },
      "position": { "x": number, "y": number }
    }
  ],
  "edges": [
    { "sourceTempId": "sender-tempId", "targetTempId": "receiver-tempId" }
  ]
}
`;
}

function getFewShotHistory(actions: any[]): Content[] {
  return [
    {
      role: "user",
      parts: [{ text: "Build an invoice processing workflow that uploads an invoice and then validates it." } as Part]
    },
    {
      role: "model",
      parts: [{
        text: `I will build a 2-step workflow. First, we need an "Invoice Upload" node to get the document into the system. Since this node produces a "file" output, we can connect it to a "Data Validation" node which accepts "json".

---JSON_START---
{
  "name": "Invoice Processor",
  "nodes": [
    {
      "tempId": "node-upload",
      "actionName": "Invoice Upload",
      "config": { "stepName": "Upload Invoice", "allowedFileTypes": ["pdf"] },
      "position": { "x": 100, "y": 100 }
    },
    {
      "tempId": "node-validate",
      "actionName": "Data Validation",
      "config": { "stepName": "Validate Data", "validationRules": "Check if amount > 0" },
      "position": { "x": 100, "y": 300 }
    }
  ],
  "edges": [
    { "sourceTempId": "node-upload", "targetTempId": "node-validate" }
  ]
}
---JSON_END---` } as Part]
    },
    {
      role: "user",
      parts: [{
        text: `Current Workflow State: {
  "name": "Invoice Processor",
  "nodes": [
    { "tempId": "node-upload", "actionName": "Invoice Upload", "config": { "stepName": "Upload Invoice" }, "position": { "x": 100, "y": 100 } },
    { "tempId": "node-validate", "actionName": "Data Validation", "config": { "stepName": "Validate Data" }, "position": { "x": 100, "y": 300 } }
  ],
  "edges": [
    { "sourceTempId": "node-upload", "targetTempId": "node-validate" }
  ]
}

Request: Add an API call at the end to save the data.` } as Part]
    },
    {
      role: "model",
      parts: [{
        text: `I will add an "API Call" node after the "Data Validation" node. This node will receive the validated JSON and send it to an external endpoint.

---JSON_START---
{
  "name": "Invoice Processor with API",
  "nodes": [
    { "tempId": "node-upload", "actionName": "Invoice Upload", "config": { "stepName": "Upload Invoice" }, "position": { "x": 100, "y": 100 } },
    { "tempId": "node-validate", "actionName": "Data Validation", "config": { "stepName": "Validate Data" }, "position": { "x": 100, "y": 300 } },
    {
      "tempId": "node-api",
      "actionName": "API Call",
      "config": { "stepName": "Export to ERP", "endpoint": "https://api.erp.provider/invoices", "method": "POST" },
      "position": { "x": 100, "y": 500 }
    }
  ],
  "edges": [
    { "sourceTempId": "node-upload", "targetTempId": "node-validate" },
    { "sourceTempId": "node-validate", "targetTempId": "node-api" }
  ]
}
---JSON_END---` } as Part]
    }
  ];
}
