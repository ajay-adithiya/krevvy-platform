-- AlterTable
ALTER TABLE "ContactPageContent" ADD COLUMN     "contactAddressHeading" TEXT,
ADD COLUMN     "contactEmailHeading" TEXT,
ADD COLUMN     "contactPhoneHeading" TEXT,
ADD COLUMN     "contactTouchpointsHeading" TEXT,
ADD COLUMN     "formLoadingMessage" TEXT,
ADD COLUMN     "successTicketPrefixLabel" TEXT;

-- AlterTable
ALTER TABLE "FaqPageContent" ADD COLUMN     "allFaqsLabel" TEXT;

-- AlterTable
ALTER TABLE "GlobalSiteContent" ADD COLUMN     "amazonModalItemLabel" TEXT,
ADD COLUMN     "amazonModalPriceLabel" TEXT,
ADD COLUMN     "amazonModalVerifiedLabel" TEXT;

-- AlterTable
ALTER TABLE "ProductsPageContent" ADD COLUMN     "bestSellersFilterLabel" TEXT,
ADD COLUMN     "categoriesFilterLabel" TEXT,
ADD COLUMN     "clearFilterLabel" TEXT,
ADD COLUMN     "featuresHeadingLabel" TEXT,
ADD COLUMN     "inStockLabel" TEXT,
ADD COLUMN     "newArrivalsFilterLabel" TEXT,
ADD COLUMN     "onDiscountFilterLabel" TEXT,
ADD COLUMN     "viewDetailsButtonLabel" TEXT,
ADD COLUMN     "warrantyLabel" TEXT;

-- CreateTable
CREATE TABLE "AmazonModalBenefit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconName" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AmazonModalBenefit_pkey" PRIMARY KEY ("id")
);
