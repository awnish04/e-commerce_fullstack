-- CreateTable
CREATE TABLE "BillboardImage" (
    "id" TEXT NOT NULL,
    "billboardId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillboardImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BillboardImage_billboardId_sortOrder_idx" ON "BillboardImage"("billboardId", "sortOrder");

-- AddForeignKey
ALTER TABLE "BillboardImage" ADD CONSTRAINT "BillboardImage_billboardId_fkey" FOREIGN KEY ("billboardId") REFERENCES "Billboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
