-- AlterTable
ALTER TABLE "WorkflowExecution" ADD COLUMN     "inputData" JSONB,
ADD COLUMN     "publishedWorkflowId" TEXT;

-- CreateTable
CREATE TABLE "PublishedWorkflow" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishedWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publishedWorkflowId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublishedWorkflow_workflowId_key" ON "PublishedWorkflow"("workflowId");

-- CreateIndex
CREATE INDEX "PublishedWorkflow_workflowId_idx" ON "PublishedWorkflow"("workflowId");

-- CreateIndex
CREATE INDEX "PublishedWorkflow_userId_idx" ON "PublishedWorkflow"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_key_idx" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_publishedWorkflowId_idx" ON "ApiKey"("publishedWorkflowId");

-- CreateIndex
CREATE INDEX "WorkflowExecution_publishedWorkflowId_idx" ON "WorkflowExecution"("publishedWorkflowId");

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_publishedWorkflowId_fkey" FOREIGN KEY ("publishedWorkflowId") REFERENCES "PublishedWorkflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_publishedWorkflowId_fkey" FOREIGN KEY ("publishedWorkflowId") REFERENCES "PublishedWorkflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
