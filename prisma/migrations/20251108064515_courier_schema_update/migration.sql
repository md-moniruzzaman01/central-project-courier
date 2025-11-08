/*
  Warnings:

  - You are about to drop the column `boxId` on the `Courier` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Courier` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Product` table. All the data in the column will be lost.
  - Added the required column `courierId` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Made the column `hawb` on table `Courier` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Courier" DROP CONSTRAINT "Courier_boxId_fkey";

-- DropIndex
DROP INDEX "public"."Courier_receiverId_idx";

-- DropIndex
DROP INDEX "public"."Courier_senderId_idx";

-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "courierId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Courier" DROP COLUMN "boxId",
DROP COLUMN "weight",
ADD COLUMN     "totalDeclaredValue" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalWeight" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "hawb" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "value";

-- CreateTable
CREATE TABLE "ProductBox" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "boxId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductBox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductBox_productId_boxId_key" ON "ProductBox"("productId", "boxId");

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "Courier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBox" ADD CONSTRAINT "ProductBox_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBox" ADD CONSTRAINT "ProductBox_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
