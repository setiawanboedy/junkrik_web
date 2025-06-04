-- AlterTable
ALTER TABLE "Pickup" ADD COLUMN     "driverId" TEXT,
ADD COLUMN     "photoUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Pickup" ADD CONSTRAINT "Pickup_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
