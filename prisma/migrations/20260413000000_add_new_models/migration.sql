-- CreateTable
CREATE TABLE "BookingSession" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "listingName" TEXT,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "guestEmail" TEXT,
    "stepReached" TEXT NOT NULL DEFAULT 'widget',
    "imageUrl" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NearbyPlace" (
    "id" TEXT NOT NULL,
    "listingId" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'restaurant',
    "distance" TEXT,
    "note" TEXT,

    CONSTRAINT "NearbyPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeownerLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "city" TEXT,
    "message" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeownerLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingSession_guestEmail_idx" ON "BookingSession"("guestEmail");

-- CreateIndex
CREATE INDEX "BookingSession_stepReached_idx" ON "BookingSession"("stepReached");

-- CreateIndex
CREATE INDEX "NearbyPlace_listingId_idx" ON "NearbyPlace"("listingId");

-- CreateIndex
CREATE INDEX "HomeownerLead_email_idx" ON "HomeownerLead"("email");

-- CreateIndex
CREATE INDEX "HomeownerLead_status_idx" ON "HomeownerLead"("status");
