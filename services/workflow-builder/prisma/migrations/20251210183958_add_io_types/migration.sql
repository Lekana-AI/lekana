/*
  Warnings:

  - Added the required column `outputType` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "inputType" TEXT,
ADD COLUMN     "outputType" TEXT NOT NULL;
