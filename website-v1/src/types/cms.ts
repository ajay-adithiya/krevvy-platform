export interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  assetType: string;
  altText?: string | null;
}

export interface GlobalSiteContent {
  id: number;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  companyName?: string | null;
  businessHours?: string | null;
  globalAmazonButtonLabel?: string | null;
  amazonModalTitle?: string | null;
  amazonModalDescription?: string | null;
  amazonModalTrustText?: string | null;
  copyrightText?: string | null;
  complianceText?: string | null;
  seoDefaultTitle?: string | null;
  seoDefaultDescription?: string | null;
  logoMediaId?: string | null;
  seoOgMediaId?: string | null;
  defaultAmazonProductId?: string | null;
  amazonModalVerifiedLabel?: string | null;
  amazonModalItemLabel?: string | null;
  amazonModalPriceLabel?: string | null;

  logoMedia?: MediaAsset | null;
  seoOgMedia?: MediaAsset | null;
  amazonModalBenefits?: AmazonModalBenefit[];
}

export interface AmazonModalBenefit {
  id: string;
  title: string;
  description: string;
  iconName?: string | null;
  displayOrder: number;
  isVisible: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  targetView: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface FooterLink {
  id: string;
  groupId: string;
  label: string;
  targetView: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface FooterGroup {
  id: string;
  title: string;
  displayOrder: number;
  isVisible: boolean;
  links: FooterLink[];
}

export interface HomePageContent {
  id: number;
  heroEyebrow?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroCtaLabel?: string | null;
  heroMediaId?: string | null;
  heroMedia?: MediaAsset | null;
  searchPlaceholder?: string | null;
  searchButtonLabel?: string | null;
  collectionEyebrow?: string | null;
  collectionTitle?: string | null;
  collectionDescription?: string | null;
}

export interface ProductsPageContent {
  id: number;
  pageEyebrow?: string | null;
  pageTitle?: string | null;
  pageSubtitle?: string | null;
  emptySearchMessage?: string | null;
  allProductsLabel?: string | null;
  viewSpecsLabel?: string | null;
  hideSpecsLabel?: string | null;
  categoriesFilterLabel?: string | null;
  newArrivalsFilterLabel?: string | null;
  bestSellersFilterLabel?: string | null;
  onDiscountFilterLabel?: string | null;
  inStockLabel?: string | null;
  warrantyLabel?: string | null;
  featuresHeadingLabel?: string | null;
  clearFilterLabel?: string | null;
  viewDetailsButtonLabel?: string | null;
}

export interface AboutPillar {
  id: string;
  title: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface AboutPageContent {
  id: number;
  pageEyebrow?: string | null;
  pageTitle?: string | null;
  pageSubtitle?: string | null;
  narrativeText?: string | null;
  enterpriseHeading?: string | null;
  enterpriseText?: string | null;
  manufacturingHeading?: string | null;
  manufacturingText?: string | null;
  certificationHeading?: string | null;
  certificationText?: string | null;
  certificationBadgeLabel?: string | null;
  pillarsHeading?: string | null;
}

export interface ContactPageContent {
  id: number;
  pageEyebrow?: string | null;
  pageTitle?: string | null;
  pageSubtitle?: string | null;
  formHeading?: string | null;
  formNameLabel?: string | null;
  formEmailLabel?: string | null;
  formPhoneLabel?: string | null;
  formSubjectLabel?: string | null;
  formMessageLabel?: string | null;
  formSubmitLabel?: string | null;
  formSuccessMessage?: string | null;
  formFailureMessage?: string | null;
  warrantyHeading?: string | null;
  warrantyText?: string | null;
  contactTouchpointsHeading?: string | null;
  contactPhoneHeading?: string | null;
  contactEmailHeading?: string | null;
  contactAddressHeading?: string | null;
  formLoadingMessage?: string | null;
  successTicketPrefixLabel?: string | null;
}

export interface FaqItem {
  id: string;
  faqCategoryId: string;
  question: string;
  answer: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface FaqCategory {
  id: string;
  slug: string;
  displayLabel: string;
  displayOrder: number;
  isVisible: boolean;
  faqs: FaqItem[];
}

export interface ContactInquiryOption {
  id: string;
  value: string;
  label: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface FaqPageContent {
  id: number;
  headerEyebrow?: string | null;
  headerTitle?: string | null;
  headerSubtitle?: string | null;
  fallbackSupportText?: string | null;
  allFaqsLabel?: string | null;
}

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  displayLabel?: string | null;
  iconName?: string | null;
  displayOrder?: number | null;
}

export interface CmsProductFeature {
  id: string;
  title: string;
  description?: string;
  displayOrder: number;
}

export interface CmsProductSpec {
  id: string;
  name: string;
  value: string;
  displayOrder: number;
}

export interface CmsProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  amazonUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  category?: CmsCategory;
  tagline?: string | null;
  isNewArrival?: boolean | null;
  isBestSeller?: boolean | null;
  discountLabel?: string | null;
  ratingDisplay?: string | null;
  reviewCountDisplay?: string | null;
  primaryColorAccent?: string | null;
  amazonButtonLabel?: string | null;
  displayOrder?: number | null;

  images?: { id: string; imageUrl: string; isPrimary: boolean }[];
  features?: CmsProductFeature[];
  specifications?: CmsProductSpec[];
}
