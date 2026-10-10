# Upload Service

File upload microservice for GCP Cloud Storage with signed URL generation.

## Port: 4001

## Quick Start

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your GCP credentials

# Start the service
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Service port | `4001` |
| `GCS_BUCKET_NAME` | GCP Cloud Storage bucket | `lekana-uploads` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to GCP service account JSON | - |
| `CLERK_DOMAIN` | Clerk authentication domain | `your-app.clerk.accounts.dev` |
| `SIGNED_URL_EXPIRY_MINUTES` | Signed URL expiry time | `60` |

## API Endpoints

### `GET /health`
Health check (public)

### `POST /api/v1/process`
Main upload endpoint for workflow runtime (protected)

**Config Schema:**
```json
{
  "stepName": "string - Display name",
  "bulkUpload": "boolean - Allow multiple files (default: false)",
  "maxFileSizeMB": "number - Max file size (default: 20)",
  "allowedFileTypes": "string[] - ['pdf', 'png', 'jpg', 'jpeg', 'tiff']"
}
```

### `POST /api/v1/upload`
Direct multipart upload (protected)

## Testing

Import `upload-service.postman_collection.json` into Postman.

## Docker

```bash
docker build -t upload-service .
docker run -p 4001:4001 -e GCS_BUCKET_NAME=your-bucket upload-service
```
# lekana-ai-upload
