-- CreateTable
CREATE TABLE "CmsContent" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT,
    "heroImage" TEXT,
    "aboutTitle" TEXT,
    "aboutDescription" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactAddress" TEXT,
    "footerText" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "youtubeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsContent_pkey" PRIMARY KEY ("id")
);
