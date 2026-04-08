-- AlterTable
ALTER TABLE "PromoCode" ADD COLUMN     "ticketsCount" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PolleriaTicket" ADD COLUMN     "promoCodeId" TEXT;

-- CreateIndex
CREATE INDEX "PolleriaTicket_promoCodeId_idx" ON "PolleriaTicket"("promoCodeId");
