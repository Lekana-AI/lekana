@echo off
REM Deploy to Google Cloud Run Script for Windows
REM Usage: deploy.bat [project-id] [region]

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_ID=%1
set REGION=%2

if "%PROJECT_ID%"=="" set PROJECT_ID=your-project-id
if "%REGION%"=="" set REGION=us-central1

set SERVICE_NAME=lekana-classification
set IMAGE_NAME=gcr.io/%PROJECT_ID%/%SERVICE_NAME%:latest

echo ╔════════════════════════════════════════════╗
echo ║  Lekana Classification - Cloud Run Deploy ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if gcloud is installed
gcloud --version >nul 2>&1
if errorlevel 1 (
    echo Error: gcloud CLI is not installed
    echo Please install: https://cloud.google.com/sdk/docs/install
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo Error: .env file not found
    echo Please create .env file from .env.example
    exit /b 1
)

REM Load environment variables from .env
for /f "tokens=1,* delims==" %%a in (.env) do (
    set %%a=%%b
)

REM Validate required environment variables
if "%MONGODB_URI%"=="" (
    echo Error: MONGODB_URI is not set in .env
    exit /b 1
)

if "%GEMINI_API_KEY%"=="" (
    echo Error: GEMINI_API_KEY is not set in .env
    exit /b 1
)

echo Configuration:
echo   Project ID: %PROJECT_ID%
echo   Region: %REGION%
echo   Service Name: %SERVICE_NAME%
echo   Image: %IMAGE_NAME%
echo.

REM Set the project
echo [1/6] Setting GCP project...
gcloud config set project %PROJECT_ID%

REM Enable required APIs
echo [2/6] Enabling required APIs...
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

REM Configure Docker for GCR
echo [3/6] Configuring Docker authentication...
gcloud auth configure-docker --quiet

REM Build the Docker image
echo [4/6] Building Docker image...
docker build -t %IMAGE_NAME% .
if errorlevel 1 (
    echo Error: Docker build failed
    exit /b 1
)

REM Push the image to GCR
echo [5/6] Pushing image to Google Container Registry...
docker push %IMAGE_NAME%
if errorlevel 1 (
    echo Error: Docker push failed
    exit /b 1
)

REM Deploy to Cloud Run
echo [6/6] Deploying to Cloud Run...
gcloud run deploy %SERVICE_NAME% ^
  --image %IMAGE_NAME% ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --set-env-vars MONGODB_URI="%MONGODB_URI%" ^
  --set-env-vars GEMINI_API_KEY="%GEMINI_API_KEY%" ^
  --set-env-vars GOOGLE_CLOUD_PROJECT="%GOOGLE_CLOUD_PROJECT%" ^
  --set-env-vars GOOGLE_CLOUD_LOCATION="%GOOGLE_CLOUD_LOCATION%" ^
  --set-env-vars DOCUMENT_AI_PROCESSOR_ID="%DOCUMENT_AI_PROCESSOR_ID%" ^
  --set-env-vars DEFAULT_CONFIDENCE_THRESHOLD="%DEFAULT_CONFIDENCE_THRESHOLD%" ^
  --set-env-vars CATEGORY_SIMILARITY_THRESHOLD="%CATEGORY_SIMILARITY_THRESHOLD%" ^
  --set-env-vars NODE_ENV="production" ^
  --set-env-vars SERVICE_VERSION="%SERVICE_VERSION%" ^
  --memory 2Gi ^
  --cpu 2 ^
  --max-instances 10 ^
  --timeout 300 ^
  --port 8080

if errorlevel 1 (
    echo Error: Cloud Run deployment failed
    exit /b 1
)

REM Get the service URL
for /f "delims=" %%i in ('gcloud run services describe %SERVICE_NAME% --region %REGION% --format "value(status.url)"') do set SERVICE_URL=%%i

echo.
echo ╔════════════════════════════════════════════╗
echo ║         Deployment Successful! ✓           ║
echo ╚════════════════════════════════════════════╝
echo.
echo Service URL: %SERVICE_URL%
echo.
echo Test your service:
echo   curl %SERVICE_URL%/health
echo.
echo View logs:
echo   gcloud run services logs read %SERVICE_NAME% --region %REGION%
echo.

endlocal
