# Lekana Document Classification Service

A production-ready microservice for intelligent document classification using Google Document AI and Gemini, with MongoDB persistence and workflow-based learning.

## 📋 Overview

This service provides AI-powered document classification with two modes:

1. **Custom Classification** - Classify documents using predefined labels with Document AI (fallback to Gemini)
2. **Auto-Categorization** - Automatically categorize documents using AI with workflow history context

> **💡 Perfect for Single Documents:** Process documents one at a time – the service learns from your workflow history to improve accuracy with each document!

### Key Features

- 🤖 **Dual AI Engine**: Google Document AI with Gemini fallback
- 📊 **Smart Learning**: Uses workflow history for better categorization
- 💾 **MongoDB Persistence**: Saves all classifications and workflow categories
- 🔄 **Auto-Deduplication**: Merges similar categories (85% similarity threshold)
- ✅ **Human Review Flags**: Low-confidence results marked for review
- 🚀 **Cloud Run Ready**: Containerized and deployment-ready

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (free tier works)
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- Google Cloud account (optional, for Document AI)

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
GEMINI_API_KEY=your-gemini-api-key

# Optional (for Document AI)
GOOGLE_CLOUD_PROJECT=your-project-id
DOCUMENT_AI_PROCESSOR_ID=your-processor-id
```

### 2. Install & Run Locally

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Or build and run production
npm run build
npm start
```

### 3. Test the Service

```bash
# Health check
curl http://localhost:8080/health

# Classify a document
curl -X POST http://localhost:8080/api/classify/auto \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "test",
    "documents": [{
      "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      "filename": "test.pdf",
      "mimeType": "application/pdf"
    }]
  }'
```

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:8080`
- **Cloud Run**: `https://your-service-url.run.app`

---

### 🟢 GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "lekana-classification",
  "version": "1.0.0",
  "timestamp": "2025-12-18T00:00:00.000Z"
}
```

---

### 🔵 POST `/api/classify/custom`

Classify documents using predefined labels.

**Request:**
```json
{
  "workflowId": "invoice_processing",
  "documents": [
    {
      "url": "https://storage.googleapis.com/bucket/doc.pdf",
      "filename": "invoice.pdf",
      "mimeType": "application/pdf"
    }
  ],
  "customLabels": ["Invoice", "Receipt", "Purchase Order", "Contract"],
  "confidenceThreshold": 0.7
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workflowId | string | ✅ | Unique workflow identifier |
| documents | array | ✅ | Documents to classify |
| documents[].url | string | ✅ | Public HTTPS URL to document |
| documents[].filename | string | ✅ | Original filename |
| documents[].mimeType | string | ✅ | MIME type (e.g., `application/pdf`) |
| customLabels | array | ✅ | Possible classification labels |
| confidenceThreshold | number | ❌ | Confidence threshold (0.0-1.0), default: 0.7 |

**Response:**
```json
{
  "success": true,
  "data": {
    "classifications": [
      {
        "documentUrl": "https://storage.googleapis.com/bucket/doc.pdf",
        "filename": "invoice.pdf",
        "label": "Invoice",
        "confidence": 0.95,
        "alternatives": [
          {"label": "Receipt", "confidence": 0.78}
        ],
        "model": "gemini"
      }
    ]
  },
  "metadata": {
    "processingTime": 1234,
    "serviceVersion": "1.0.0",
    "modelUsed": "gemini"
  },
  "requiresHumanReview": false
}
```

---

### 🟣 POST `/api/classify/auto`

Automatically categorize documents using AI with workflow learning.

**Request:**
```json
{
  "workflowId": "my_documents",
  "documents": [
    {
      "url": "https://storage.googleapis.com/bucket/doc.pdf",
      "filename": "document.pdf",
      "mimeType": "application/pdf"
    }
  ],
  "confidenceThreshold": 0.7
}
```

**How It Works:**
1. Fetches existing categories for the workflow
2. Uses Gemini with category context for better accuracy
3. Checks for similar existing categories (85% similarity)
4. Matches to existing category or creates new one
5. Saves to MongoDB

**Example - Progressive Learning:**
```javascript
// Document 1
POST /api/classify/auto { workflowId: "accounting" }
→ Creates "Invoice" category

// Document 2
POST /api/classify/auto { workflowId: "accounting" }
→ AI sees ["Invoice"] in context
→ Creates "Receipt" category

// Document 3
POST /api/classify/auto { workflowId: "accounting" }
→ AI sees ["Invoice", "Receipt"]
→ Matches to "Invoice" (similar document)
→ Count increments to 2
```

---

## 💾 MongoDB Storage

The service automatically saves all data to MongoDB in **two collections**:

### Collection 1: `workflows`

Stores workflow categories and statistics.

```javascript
{
  workflowId: "accounting_docs",
  categories: [
    {
      label: "Invoice",
      normalizedLabel: "invoice",
      firstSeenAt: ISODate("2024-01-01T10:00:00Z"),
      count: 15
    },
    {
      label: "Receipt",
      normalizedLabel: "receipt",
      firstSeenAt: ISODate("2024-01-01T11:00:00Z"),
      count: 8
    }
  ],
  createdAt: ISODate("2024-01-01T10:00:00Z"),
  updatedAt: ISODate("2024-01-02T15:30:00Z")
}
```

### Collection 2: `documents`

Stores individual document classifications.

```javascript
{
  workflowId: "accounting_docs",
  documentUrl: "https://storage.googleapis.com/bucket/doc.pdf",
  filename: "invoice_001.pdf",
  mimeType: "application/pdf",
  classification: {
    label: "Invoice",
    confidence: 0.95,
    alternatives: [...],
    model: "gemini"
  },
  requiresHumanReview: false,
  createdAt: ISODate("2024-01-01T10:00:00Z")
}
```

### Verify Data in MongoDB

```javascript
// Using MongoDB Compass or shell

// View workflow categories
db.workflows.findOne({ workflowId: "accounting_docs" })

// View all classified documents
db.documents.find({ workflowId: "accounting_docs" })

// Count documents by category
db.documents.aggregate([
  { $group: { 
      _id: "$classification.label", 
      count: { $sum: 1 } 
  }}
])
```

---

## 🔄 Workflow Context Learning

The service gets smarter with each document in the same workflow:

```
Document 1 → Creates "Invoice"
Document 2 → Sees ["Invoice"], creates "Receipt"
Document 3 → Sees ["Invoice", "Receipt"], matches "Invoice"
Document 10 → Has full context of 9 previous categories
            → More accurate suggestions
            → Better consistency!
```

### Workflow ID Strategies

Choose your workflow ID based on your use case:

| Strategy | Example | Use Case |
|----------|---------|----------|
| **User-based** | `user_12345_docs` | Personal document management |
| **Department** | `legal_department` | Team collaboration |
| **Project** | `project_apollo` | Project-specific docs |
| **Time-based** | `docs_2024_q4` | Periodic processing |
| **Type-based** | `financial_docs` | Document repositories |

---

## 🧪 Testing Guide

### Manual Testing

```bash
# Test 1: Health check
curl http://localhost:8080/health

# Test 2: Classify single document
curl -X POST http://localhost:8080/api/classify/auto \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "test_workflow",
    "documents": [{
      "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      "filename": "test.pdf",
      "mimeType": "application/pdf"
    }]
  }'

# Test 3: Verify in MongoDB
# Connect to MongoDB and check:
db.workflows.find()
db.documents.find()
```

### Using Your Own Documents

Documents must be **publicly accessible HTTPS URLs**. Options:

1. **Google Cloud Storage** - Upload and make public or use signed URLs
2. **AWS S3** - Use public bucket or pre-signed URLs
3. **Any public URL** - Direct links to PDFs/images

**Supported MIME Types:**
- `application/pdf`
- `image/png`, `image/jpeg`, `image/jpg`
- `image/gif`, `image/bmp`, `image/tiff`, `image/webp`

---

## 🚀 Deploy to Google Cloud Run

### Option 1: Automated Deployment (Recommended)

**Windows:**
```bash
deploy.bat YOUR_PROJECT_ID us-central1
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh YOUR_PROJECT_ID us-central1
```

### Option 2: Manual Deployment

```bash
# 1. Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/lekana-classification:latest .

# 2. Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/lekana-classification:latest

# 3. Deploy to Cloud Run
gcloud run deploy lekana-classification \
  --image gcr.io/YOUR_PROJECT_ID/lekana-classification:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="your-mongodb-uri" \
  --set-env-vars GEMINI_API_KEY="your-gemini-key" \
  --set-env-vars GOOGLE_CLOUD_PROJECT="your-project-id" \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --timeout 300
```

### Using Secrets (Recommended for Production)

```bash
# Create secrets
echo -n "your-mongodb-uri" | gcloud secrets create mongodb-uri --data-file=-
echo -n "your-gemini-key" | gcloud secrets create gemini-api-key --data-file=-

# Deploy with secrets
gcloud run deploy lekana-classification \
  --image gcr.io/YOUR_PROJECT_ID/lekana-classification:latest \
  --update-secrets MONGODB_URI=mongodb-uri:latest \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --region us-central1 \
  --memory 2Gi
```

### Verify Deployment

```bash
# Get service URL
gcloud run services describe lekana-classification --region us-central1 --format 'value(status.url)'

# Test deployed service
curl https://your-service-url.run.app/health
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | ❌ | 8080 | Server port |
| `NODE_ENV` | ❌ | production | Environment |
| `MONGODB_URI` | ✅ | - | MongoDB connection string |
| `GEMINI_API_KEY` | ✅ | - | Google Gemini API key |
| `GOOGLE_CLOUD_PROJECT` | ✅ | - | GCP project ID |
| `GOOGLE_CLOUD_LOCATION` | ❌ | us | Document AI location |
| `DOCUMENT_AI_PROCESSOR_ID` | ❌ | - | Document AI processor |
| `DEFAULT_CONFIDENCE_THRESHOLD` | ❌ | 0.7 | Confidence threshold |
| `CATEGORY_SIMILARITY_THRESHOLD` | ❌ | 0.85 | Category similarity |
| `CORS_ORIGIN` | ❌ | * | CORS allowed origins |

---

## 💡 Usage Examples

### JavaScript/Node.js

```javascript
async function classifyDocument(fileUrl, filename) {
  const response = await fetch('http://localhost:8080/api/classify/auto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workflowId: 'my_workflow',
      documents: [{
        url: fileUrl,
        filename: filename,
        mimeType: 'application/pdf'
      }]
    })
  });
  
  const result = await response.json();
  const classification = result.data.classifications[0];
  
  console.log('Category:', classification.label);
  console.log('Confidence:', classification.confidence);
  
  if (result.requiresHumanReview) {
    console.log('⚠️ Low confidence - needs review');
  }
  
  return classification.label;
}
```

### Python

```python
import requests

def classify_document(file_url, filename):
    response = requests.post(
        'http://localhost:8080/api/classify/auto',
        json={
            'workflowId': 'my_workflow',
            'documents': [{
                'url': file_url,
                'filename': filename,
                'mimeType': 'application/pdf'
            }]
        }
    )
    
    result = response.json()
    classification = result['data']['classifications'][0]
    
    print(f"Category: {classification['label']}")
    print(f"Confidence: {classification['confidence']}")
    
    if result['requiresHumanReview']:
        print("⚠️ Low confidence - needs review")
    
    return classification['label']
```

### cURL

```bash
# Single document
curl -X POST http://localhost:8080/api/classify/auto \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "docs",
    "documents": [{
      "url": "https://example.com/doc.pdf",
      "filename": "doc.pdf",
      "mimeType": "application/pdf"
    }]
  }'

# Multiple documents
curl -X POST http://localhost:8080/api/classify/custom \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "batch",
    "documents": [
      {"url": "https://example.com/doc1.pdf", "filename": "doc1.pdf", "mimeType": "application/pdf"},
      {"url": "https://example.com/doc2.pdf", "filename": "doc2.pdf", "mimeType": "application/pdf"}
    ],
    "customLabels": ["Invoice", "Receipt", "Contract"]
  }'
```

---

## 🛠️ Troubleshooting

### MongoDB Connection Failed

**Problem:** `MongooseError: Could not connect to MongoDB`

**Solutions:**
- Verify `MONGODB_URI` is correct in `.env`
- Check MongoDB Atlas network access (allow 0.0.0.0/0 for Cloud Run)
- Ensure database user has read/write permissions

### Document URL Not Accessible

**Problem:** `Failed to fetch document`

**Solutions:**
- Ensure URLs are publicly accessible HTTPS
- For private files, use signed URLs with sufficient expiration
- Check CORS settings on storage bucket

### All Documents Require Review

**Problem:** Every classification has `requiresHumanReview: true`

**Solutions:**
- Lower confidence threshold (0.5-0.6 for testing)
- Use more specific custom labels
- Check document quality (readable text, clear content)

### Low Categorization Accuracy

**Solutions:**
- Use consistent workflow IDs to build history
- Process more documents in the same workflow (learning improves)
- Use `/custom` endpoint with specific labels
- Review and merge similar categories manually

---

## 📊 Best Practices

### 1. Workflow IDs
✅ Use descriptive, consistent IDs: `accounting_q4_2024`  
❌ Don't use random IDs: `workflow_abc123`

### 2. Document Processing
✅ Process similar documents in the same workflow  
✅ Reuse workflow IDs for learning benefits  
❌ Don't create new workflow for each document

### 3. Confidence Thresholds
- **0.9**: High-stakes, regulatory documents
- **0.7**: Standard business operations (default)
- **0.5**: Bulk processing, low-risk documents

### 4. Category Management
- Review categories periodically
- Manually merge overly similar categories
- Monitor category growth
- Keep categories meaningful and distinct

### 5. Error Handling
```javascript
try {
  const result = await classifyDocument(url);
  if (result.requiresHumanReview) {
    await sendToReviewQueue(result);
  } else {
    await processAutomatically(result);
  }
} catch (error) {
  console.error('Classification failed:', error);
  await sendToManualProcessing(document);
}
```

---

## 📁 Project Structure

```
lekana-classification/
├── src/
│   ├── controllers/        # Request handlers
│   ├── services/          # AI & business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Validation & errors
│   ├── utils/             # Helper functions
│   ├── types/             # TypeScript types
│   ├── config/            # Database config
│   ├── app.ts             # Express app
│   └── server.ts          # Entry point
├── Dockerfile             # Container build
├── deploy.sh              # Linux/Mac deployment
├── deploy.bat             # Windows deployment
├── .env.example           # Environment template
├── package.json           # Dependencies
└── README.md              # This file
```

---

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Run with hot reload
npm run build           # Build TypeScript
npm start               # Run production build

# Docker
docker build -t lekana-classification .
docker run -p 8080:8080 --env-file .env lekana-classification

# Cloud Run
gcloud run services logs read lekana-classification --region us-central1
gcloud run services describe lekana-classification --region us-central1
gcloud run services update lekana-classification --set-env-vars KEY=VALUE
```

---

## 📄 License

ISC

---

## 🤝 Support

For issues:
1. Check service health: `GET /health`
2. Review Cloud Run logs: `gcloud run services logs read lekana-classification`
3. Verify environment variables
4. Test with simple request

---

**Made with ❤️ using Google Cloud AI**
#   l e k a n a - c l a s s i f i c a t i o n  
 