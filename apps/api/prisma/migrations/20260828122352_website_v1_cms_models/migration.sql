-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "displayLabel" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "iconName" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "amazonButtonLabel" TEXT,
ADD COLUMN     "discountLabel" TEXT,
ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "primaryColorAccent" TEXT,
ADD COLUMN     "ratingDisplay" DECIMAL(3,1) NOT NULL DEFAULT 5.0,
ADD COLUMN     "reviewCountDisplay" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tagline" TEXT,
ALTER COLUMN "isFeatured" SET DEFAULT true;

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "altText" TEXT,
    "filename" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFeature" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSpecification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductSpecification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetView" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FooterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterLink" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetView" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayLabel" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FaqCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "faqCategoryId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPillar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AboutPillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSiteContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "seoGlobalTitle" TEXT,
    "seoGlobalDescription" TEXT,
    "seoOgMediaId" TEXT,
    "logoMediaId" TEXT,
    "footerBrandDescription" TEXT,
    "copyrightText" TEXT,
    "complianceText" TEXT,
    "mobileMenuOpenLabel" TEXT,
    "mobileMenuCloseLabel" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "hqAddress" TEXT,
    "businessHours" TEXT,
    "defaultAmazonProductId" TEXT,
    "buyOnAmazonLabel" TEXT,
    "amazonModalTitle" TEXT,
    "amazonModalSubtitle" TEXT,
    "amazonModalContinueLabel" TEXT,
    "amazonModalCancelLabel" TEXT,
    "amazonModalTrustText" TEXT,

    CONSTRAINT "GlobalSiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroEyebrow" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroCtaLabel" TEXT,
    "heroMediaId" TEXT,
    "searchPlaceholder" TEXT,
    "searchButtonLabel" TEXT,
    "collectionEyebrow" TEXT,
    "collectionTitle" TEXT,
    "collectionDescription" TEXT,

    CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsPageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "pageEyebrow" TEXT,
    "pageTitle" TEXT,
    "pageSubtitle" TEXT,
    "emptySearchMessage" TEXT,
    "allProductsLabel" TEXT,
    "viewTechSpecsLabel" TEXT,
    "hideTechSpecsLabel" TEXT,

    CONSTRAINT "ProductsPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "credoEyebrow" TEXT,
    "credoTitle" TEXT,
    "narrativeText" TEXT,
    "enterpriseTitle" TEXT,
    "enterpriseDescription" TEXT,
    "manufacturingBaseTitle" TEXT,
    "manufacturingBaseSubtitle" TEXT,
    "certificationTitle" TEXT,
    "certificationDescription" TEXT,
    "certificationBadgeLabel" TEXT,

    CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "headerEyebrow" TEXT,
    "headerTitle" TEXT,
    "headerSubtitle" TEXT,
    "warrantyCardTitle" TEXT,
    "warrantyCardText" TEXT,
    "formNameLabel" TEXT,
    "formEmailLabel" TEXT,
    "formPhoneLabel" TEXT,
    "formCategoryLabel" TEXT,
    "formMessageLabel" TEXT,
    "formSubmitLabel" TEXT,
    "validationRequiredMessage" TEXT,
    "validationEmailMessage" TEXT,
    "successMessageTitle" TEXT,
    "successMessageDescription" TEXT,
    "successResetButtonLabel" TEXT,

    CONSTRAINT "ContactPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqPageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "headerEyebrow" TEXT,
    "headerTitle" TEXT,
    "headerSubtitle" TEXT,
    "fallbackSupportText" TEXT,

    CONSTRAINT "FaqPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FaqCategory_slug_key" ON "FaqCategory"("slug");

-- AddForeignKey
ALTER TABLE "ProductFeature" ADD CONSTRAINT "ProductFeature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpecification" ADD CONSTRAINT "ProductSpecification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FooterLink" ADD CONSTRAINT "FooterLink_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "FooterGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_faqCategoryId_fkey" FOREIGN KEY ("faqCategoryId") REFERENCES "FaqCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSiteContent" ADD CONSTRAINT "GlobalSiteContent_seoOgMediaId_fkey" FOREIGN KEY ("seoOgMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSiteContent" ADD CONSTRAINT "GlobalSiteContent_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSiteContent" ADD CONSTRAINT "GlobalSiteContent_defaultAmazonProductId_fkey" FOREIGN KEY ("defaultAmazonProductId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePageContent" ADD CONSTRAINT "HomePageContent_heroMediaId_fkey" FOREIGN KEY ("heroMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
