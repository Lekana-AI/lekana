#!/bin/bash

# Deploy to Google Cloud Run Script
# Usage: ./deploy.sh [project-id] [region]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${1:-"your-project-id"}
REGION=${2:-"us-central1"}
SERVICE_NAME="lekana-classification"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Lekana Classification - Cloud Run Deploy ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Source environment variables
source .env

# Validate required environment variables
if [ -z "$MONGODB_URI" ]; then
    echo -e "${RED}Error: MONGODB_URI is not set in .env${NC}"
    exit 1
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}Error: GEMINI_API_KEY is not set in .env${NC}"
    exit 1
fi

echo -e "${YELLOW}Configuration:${NC}"
echo "  Project ID: ${PROJECT_ID}"
echo "  Region: ${REGION}"
echo "  Service Name: ${SERVICE_NAME}"
echo "  Image: ${IMAGE_NAME}"
echo ""

# Set the project
echo -e "${YELLOW}[1/6] Setting GCP project...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}[2/6] Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Configure Docker for GCR
echo -e "${YELLOW}[3/6] Configuring Docker authentication...${NC}"
gcloud auth configure-docker --quiet

# Build the Docker image
echo -e "${YELLOW}[4/6] Building Docker image...${NC}"
docker build -t ${IMAGE_NAME} .

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
fi

# Push the image to GCR
echo -e "${YELLOW}[5/6] Pushing image to Google Container Registry...${NC}"
docker push ${IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker push failed${NC}"
    exit 1
fi

# Deploy to Cloud Run
echo -e "${YELLOW}[6/6] Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="${MONGODB_URI}" \
  --set-env-vars GEMINI_API_KEY="${GEMINI_API_KEY}" \
  --set-env-vars GOOGLE_CLOUD_PROJECT="${GOOGLE_CLOUD_PROJECT}" \
  --set-env-vars GOOGLE_CLOUD_LOCATION="${GOOGLE_CLOUD_LOCATION}" \
  --set-env-vars DOCUMENT_AI_PROCESSOR_ID="${DOCUMENT_AI_PROCESSOR_ID}" \
  --set-env-vars DEFAULT_CONFIDENCE_THRESHOLD="${DEFAULT_CONFIDENCE_THRESHOLD}" \
  --set-env-vars CATEGORY_SIMILARITY_THRESHOLD="${CATEGORY_SIMILARITY_THRESHOLD}" \
  --set-env-vars NODE_ENV="production" \
  --set-env-vars SERVICE_VERSION="${SERVICE_VERSION}" \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --timeout 300 \
  --port 8080

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Cloud Run deployment failed${NC}"
    exit 1
fi

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deployment Successful! ✓           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Service URL: ${SERVICE_URL}${NC}"
echo ""
echo "Test your service:"
echo -e "  ${YELLOW}curl ${SERVICE_URL}/health${NC}"
echo ""
echo "View logs:"
echo -e "  ${YELLOW}gcloud run services logs read ${SERVICE_NAME} --region ${REGION}${NC}"
echo ""
