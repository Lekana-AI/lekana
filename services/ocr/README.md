# OCR Service

Hybrid Document AI + Gemini extraction microservice for high-accuracy OCR.

## Port
`4004`

## Features

- **2-Step Extraction**: Document AI for initial OCR → Gemini for semantic refinement
- **Form Parser**: Extract specific fields with key-value parsing
- **Enterprise OCR**: Dense text extraction for full documents
- **Field Validation**: Apply custom rules per field (e.g., NIC format validation)
- **Processor Management**: Train, deploy, and manage Document AI processor versions

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/process` | Main extraction endpoint (ServiceRequest format) |
| POST | `/api/v1/configure` | Processor version management |
| GET | `/api/v1/configure/status/:opId` | Check training operation status |

## Quick Start

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your credentials

# Run in development
npm run dev
```

## Configuration

### Environment Variables

```env
PORT=4004
CLERK_DOMAIN=your-clerk-domain

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
DOCUMENT_AI_PROJECT_ID=your-project-id
DOCUMENT_AI_LOCATION=us
DOCUMENT_AI_FORM_PARSER_ID=your-form-parser-id
DOCUMENT_AI_OCR_PROCESSOR_ID=your-ocr-processor-id

# Gemini
GEMINI_API_KEY=your-gemini-api-key
```

### Config Schema (ServiceRequest.config)

```json
{
  "extractFields": ["nic", "name", "dob"],
  "fieldPrompts": {
    "nic": "NIC has 10 digits OR 9 digits + V/X at end",
    "dob": "Date format: DD/MM/YYYY"
  },
  "processorType": "FORM_PARSER"
}
```

## Usage

### Extract with Field Validation

```bash
curl -X POST http://localhost:4004/api/v1/process \
  -H "Content-Type: application/json" \
  -d '{
    "executionId": "exec-1",
    "nodeId": "node-1",
    "workflowId": "wf-1",
    "userId": "user-1",
    "input": {
      "documents": [
        {
          "url": "https://storage.com/id_card.jpg",
          "filename": "id_card.jpg",
          "mimeType": "image/jpeg"
        }
      ]
    },
    "config": {
      "extractFields": ["nic", "name"],
      "fieldPrompts": {
        "nic": "NIC: 10 digits or 9 digits + V/X"
      }
    }
  }'
```

### Full OCR (No Fields)

```bash
curl -X POST http://localhost:4004/api/v1/process \
  -H "Content-Type: application/json" \
  -d '{
    "executionId": "exec-2",
    "nodeId": "node-1",
    "workflowId": "wf-1",
    "userId": "user-1",
    "input": {
      "documents": [
        {
          "url": "https://storage.com/receipt.pdf",
          "filename": "receipt.pdf",
          "mimeType": "application/pdf"
        }
      ]
    },
    "config": {}
  }'
```

### Train Processor Version

```bash
curl -X POST http://localhost:4004/api/v1/configure \
  -H "Content-Type: application/json" \
  -d '{
    "action": "train",
    "processorId": "your-processor-id",
    "versionName": "v2-fine-tuned",
    "trainDataUri": "gs://bucket/train/",
    "testDataUri": "gs://bucket/test/"
  }'
```

## Runtime Integration

The runtime already has this service registered:
- URL: `OCR_SERVICE_URL` (default: `http://localhost:4004`)
- Action aliases: `ocr`, `ocr processing`, `text extraction`, `extract text`

Add to runtime `.env`:
```env
OCR_SERVICE_URL=http://localhost:4004
```
# lekana-ai-ocr
