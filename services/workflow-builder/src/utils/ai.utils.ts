import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

if (!GEMINI_API_KEY) {
  console.error("WARNING: GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
    model: GEMINI_MODEL,
    systemInstruction: getSystemInstruction(actions)
  });

  const chat = model.startChat({
    history: getFewShotHistory(actions)
  });

  const userMessage = currentState
    ? `Current Workflow State: ${JSON.stringify(currentState, null, 2)}\n\nUser Request: ${prompt}`
    : `User Request: ${prompt}`;

  try {
    const result = await chat.sendMessageStream(userMessage);

    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  } catch (error) {
    console.error(`Error in streamWorkflowGeneration using model ${GEMINI_MODEL}:`, error);
    throw error;
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
