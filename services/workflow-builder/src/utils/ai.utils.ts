import { GoogleGenAI, Content, Part } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
  const chat = genAI.chats.create({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction: getSystemInstruction(actions)
    },
    history: getFewShotHistory(actions)
  });

  const userMessage = currentState
    ? `Current Workflow State: ${JSON.stringify(currentState, null, 2)}\n\nUser Request: ${prompt}`
    : `User Request: ${prompt}`;

  const result = await chat.sendMessageStream({ message: userMessage });

  for await (const chunk of result) {
    yield chunk.text || "";
  }
}

function getSystemInstruction(actions: any[]): string {
  const activeActions = actions.filter(a => a.isActive !== false);
  const actionDocs = activeActions.map(a => ({
    name: a.name,
    description: a.description,
    configSchema: a.configSchema,
    configMeta: a.configMeta,
    inputType: a.inputType,
    outputType: a.outputType
  }));
  // console.log(actionDocs);

  return `You are an expert AI Workflow Architect for "Lekana AI Workflow Builder".
Your goal is to help users build or refine automation workflows.

### RULES
1. **THINKING FIRST**: Always start by explaining your reasoning and plan. Keep this part conversational. If you made any assumptions or left required fields empty (especially passwords), you MUST mention it here.
2. **JSON OUTPUT**: After your explanation, provide a SINGLE JSON block containing the workflow configuration.
3. **MARKERS**: You MUST wrap the JSON exactly with "---JSON_START---" before and "---JSON_END---" after. This is CRITICAL. Without these markers, the system will fail. 
4. **NO MARKDOWN CODE BLOCKS**: Do NOT use triple backticks (\`\`\`json or \`\`\`). Just output the raw JSON between the markers. If you use backticks, the user will see raw JSON, which is a BAD experience.
5. **ONLY USE ACTIONS LISTED BELOW**: Do not invent new types of nodes.
6. **CONNECT COMPATIBLE NODES**: Use the inputType and outputType to ensure logical flow.
7. **LAYOUT**: Suggest reasonable X and Y poassistions for nodes to make the graph readable.
8. **REFINEMENT**: If a current state is provided, modify it according to the user request. Retain the existing tempIds where possible.
9. **PUBLISH WARNING**: If the user asks how to run/test the workflow, inform them that they must first **Publish** the workflow using the "Publish" button in the editor.
10. **UNSUPPORTED REQUESTS**: If the user asks for something that the current actions cannot perform, simply abort and apologize. If you cannot do what is asked, refuse and ask if they need help with anything you can do, and list a few examples.
11. **NO TRAILING TEXT**: Do NOT write anything after the "---JSON_END---" marker.
12. **ASSUMPTIONS & MISSING DATA**: If you make an assumption to fill a required field (e.g., guessing an API endpoint), explicitly state it in your reasoning. If you cannot determine a value for a required field, leave it empty in the JSON and notify the user to fill it.
13. **PASSWORDS & SENSITIVE DATA**: NEVER attempt to fill passwords, API keys, or secret tokens. Leave them empty in the JSON and explicitly notify the user that they must provide these credentials.

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
      parts: [{ text: "Build an invoice processing workflow that uploads an invoice, extracts the amount and date, and then saves it to a database." } as Part]
    },
    {
      role: "model",
      parts: [{
        text: `I will build a 3-step workflow. First, we'll use "Upload files" to ingest the invoice. Then, we'll use "OCR" in "field-extract" mode to pull out the amount and date. Finally, we'll use "Database Export" to save those values into your Postgres table.

---JSON_START---
{
  "name": "Invoice Processor",
  "nodes": [
    {
      "tempId": "node-upload",
      "actionName": "Upload files",
      "config": {
        "stepName": "Upload Invoice",
        "allowedFileTypes": ["pdf", "images"]
      },
      "position": { "x": 100, "y": 100 }
    },
    {
      "tempId": "node-ocr",
      "actionName": "OCR",
      "config": {
        "stepName": "Extract Invoice Data",
        "outputMode": "field-extract",
        "extractFields": [
          { "key": "total_amount", "value": "What is the total amount inclusive of tax?" },
          { "key": "invoice_date", "value": "What is the date of the invoice?" }
        ]
      },
      "position": { "x": 100, "y": 300 }
    },
    {
      "tempId": "node-db",
      "actionName": "Database Export",
      "config": {
        "stepName": "Save to DB",
        "tableName": "invoices",
        "databaseUrl": "",
        "fieldMapping": [
          { "key": "total_amount", "value": "amount" },
          { "key": "invoice_date", "value": "date" }
        ]
      },
      "position": { "x": 100, "y": 500 }
    }
  ],
  "edges": [
    { "sourceTempId": "node-upload", "targetTempId": "node-ocr" },
    { "sourceTempId": "node-ocr", "targetTempId": "node-db" }
  ]
}
---JSON_END---` } as Part]
    },
    {
      role: "user",
      parts: [{
        text: "I want to classify documents first. If it's an 'Invoice', extract fields, otherwise just ignore."
      } as Part]
    },
    {
      role: "model",
      parts: [{
        text: `I will add a "Classification" step after the upload. The "Conditional Router" will then check if the label is "Invoice" before passing it to the OCR step.

---JSON_START---
{
  "name": "Classified Invoice Processor",
  "nodes": [
    {
      "tempId": "node-upload",
      "actionName": "Upload files",
      "config": { "stepName": "Upload Doc" },
      "position": { "x": 250, "y": 50 }
    },
    {
      "tempId": "node-classify",
      "actionName": "Classification",
      "config": {
        "stepName": "Classify Doc",
        "mode": "custom",
        "customLabels": ["Invoice", "Receipt", "Other"]
      },
      "position": { "x": 250, "y": 200 }
    },
    {
      "tempId": "node-router",
      "actionName": "Conditional Router",
      "config": {
        "stepName": "Is it an Invoice?",
        "routeByField": "label",
        "routeValue": "Invoice",
        "operator": "equals"
      },
      "position": { "x": 250, "y": 350 }
    },
    {
      "tempId": "node-ocr",
      "actionName": "OCR",
      "config": {
        "stepName": "Extract Data",
        "outputMode": "field-extract",
        "extractFields": [{ "key": "amount", "value": "Total amount" }]
      },
      "position": { "x": 250, "y": 500 }
    }
  ],
  "edges": [
    { "sourceTempId": "node-upload", "targetTempId": "node-classify" },
    { "sourceTempId": "node-classify", "targetTempId": "node-router" },
    { "sourceTempId": "node-router", "targetTempId": "node-ocr" }
  ]
}
---JSON_END---` } as Part]
    }
  ];
}
