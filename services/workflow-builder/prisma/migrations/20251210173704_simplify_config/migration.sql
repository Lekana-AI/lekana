/*
  Warnings:

  - You are about to drop the column `type` on the `WorkflowNode` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actionId` to the `WorkflowNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkflowNode" DROP COLUMN "type",
ADD COLUMN     "actionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ActionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "configSchema" JSONB NOT NULL,
    "configMeta" JSONB,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ActionCategory_name_key" ON "ActionCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Action_name_key" ON "Action"("name");

-- CreateIndex
CREATE INDEX "Action_categoryId_idx" ON "Action"("categoryId");

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- CreateIndex
CREATE INDEX "WorkflowEdge_workflowId_idx" ON "WorkflowEdge"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowNode_workflowId_idx" ON "WorkflowNode"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowNode_actionId_idx" ON "WorkflowNode"("actionId");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowNode" ADD CONSTRAINT "WorkflowNode_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "Action"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEdge" ADD CONSTRAINT "WorkflowEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "WorkflowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowEdge" ADD CONSTRAINT "WorkflowEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "WorkflowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ActionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
