/*
  Warnings:

  - You are about to drop the column `actualDate` on the `Pickup` table. All the data in the column will be lost.
  - You are about to drop the column `driverName` on the `Pickup` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Pickup` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Pickup` table. All the data in the column will be lost.
  - You are about to drop the column `wasteCollected` on the `Pickup` table. All the data in the column will be lost.
  - You are about to drop the column `carbonReduction` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `organicWaste` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `recycledWaste` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `totalWaste` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,year,month,type]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Pickup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupDate` to the `Pickup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Pickup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pickup" DROP CONSTRAINT "Pickup_scheduleId_fkey";

-- DropIndex
DROP INDEX "Report_userId_month_year_key";

-- AlterTable
ALTER TABLE "Pickup" DROP COLUMN "actualDate",
DROP COLUMN "driverName",
DROP COLUMN "notes",
DROP COLUMN "scheduledDate",
DROP COLUMN "wasteCollected",
ADD COLUMN     "actualWeight" DOUBLE PRECISION,
ADD COLUMN     "address" JSONB NOT NULL,
ADD COLUMN     "driverNotes" TEXT,
ADD COLUMN     "estimatedWeight" DOUBLE PRECISION,
ADD COLUMN     "pickupDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "specialInstructions" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "wasteTypes" TEXT[],
ALTER COLUMN "scheduleId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "carbonReduction",
DROP COLUMN "organicWaste",
DROP COLUMN "recycledWaste",
DROP COLUMN "totalWaste",
ADD COLUMN     "costSavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recycledWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "recyclingRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalPickups" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "wasteTypeBreakdown" JSONB NOT NULL DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Report_userId_year_month_type_key" ON "Report"("userId", "year", "month", "type");

-- AddForeignKey
ALTER TABLE "Pickup" ADD CONSTRAINT "Pickup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pickup" ADD CONSTRAINT "Pickup_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
