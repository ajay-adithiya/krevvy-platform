-- AlterTable
ALTER TABLE "GlobalSiteContent" ADD COLUMN     "companyName" TEXT;

-- CreateTable
CREATE TABLE "ContactInquiryOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContactInquiryOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactInquiryOption_value_key" ON "ContactInquiryOption"("value");
