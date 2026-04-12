-- AlterTable
ALTER TABLE "BookingRequest" ADD COLUMN     "ccFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "hostawayListingId" INTEGER,
ADD COLUMN     "hostawayReservationId" INTEGER,
ADD COLUMN     "houseRulesAck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'card',
ADD COLUMN     "petInfo" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "tripDescription" TEXT;
