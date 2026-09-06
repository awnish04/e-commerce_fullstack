/*
  Warnings:

  - Added the required column `billboardId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Billboard_storeId_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "billboardId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Billboard_storeId_idx" ON "Billboard"("storeId");

-- CreateIndex
CREATE INDEX "Category_billboardId_idx" ON "Category"("billboardId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_billboardId_fkey" FOREIGN KEY ("billboardId") REFERENCES "Billboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
