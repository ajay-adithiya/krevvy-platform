import api from "@/lib/api";

// --- TYPES ---

// Global
export type GlobalSiteContent = {
  id: number;
  seoGlobalTitle?: string;
  seoGlobalDescription?: string;
  seoOgMediaId?: string;
  logoMediaId?: string;
  footerBrandDescription?: string;
  copyrightText?: string;
  complianceText?: string;
  mobileMenuOpenLabel?: string;
  mobileMenuCloseLabel?: string;
  contactPhone?: string;
  contactEmail?: string;
  hqAddress?: string;
  businessHours?: string;
  defaultAmazonProductId?: string;
  buyOnAmazonLabel?: string;
  amazonModalTitle?: string;
  amazonModalSubtitle?: string;
  amazonModalContinueLabel?: string;
  amazonModalCancelLabel?: string;
  amazonModalTrustText?: string;
  amazonModalVerifiedLabel?: string;
  amazonModalItemLabel?: string;
  amazonModalPriceLabel?: string;
  logoMedia?: any;
  seoOgMedia?: any;
};

// Home
export type HomePageContent = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaLabel?: string;
  heroMediaId?: string;
  searchPlaceholder?: string;
  searchButtonLabel?: string;
  collectionEyebrow?: string;
  collectionTitle?: string;
  collectionDescription?: string;
  heroMedia?: any;
};

// Products Page
export type ProductsPageContent = {
  pageEyebrow?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  emptySearchMessage?: string;
  allProductsLabel?: string;
  viewTechSpecsLabel?: string;
  hideTechSpecsLabel?: string;
  categoriesFilterLabel?: string;
  newArrivalsFilterLabel?: string;
  bestSellersFilterLabel?: string;
  onDiscountFilterLabel?: string;
  inStockLabel?: string;
  warrantyLabel?: string;
  featuresHeadingLabel?: string;
  clearFilterLabel?: string;
  viewDetailsButtonLabel?: string;
};

// About Page
export type AboutPageContent = {
  credoEyebrow?: string;
  credoTitle?: string;
  narrativeText?: string;
  enterpriseTitle?: string;
  enterpriseDescription?: string;
  manufacturingBaseTitle?: string;
  manufacturingBaseSubtitle?: string;
  certificationTitle?: string;
  certificationDescription?: string;
  certificationBadgeLabel?: string;
};

// Contact Page
export type ContactPageContent = {
  headerEyebrow?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  warrantyCardTitle?: string;
  warrantyCardText?: string;
  formNameLabel?: string;
  formEmailLabel?: string;
  formPhoneLabel?: string;
  formCategoryLabel?: string;
  formMessageLabel?: string;
  formSubmitLabel?: string;
  validationRequiredMessage?: string;
  validationEmailMessage?: string;
  successMessageTitle?: string;
  successMessageDescription?: string;
  successResetButtonLabel?: string;
  contactTouchpointsHeading?: string;
  contactPhoneHeading?: string;
  contactEmailHeading?: string;
  contactAddressHeading?: string;
  formLoadingMessage?: string;
  successTicketPrefixLabel?: string;
};

// FAQ Page
export type FaqPageContent = {
  headerEyebrow?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  fallbackSupportText?: string;
  allFaqsLabel?: string;
};

// Repeatables
export type NavigationItem = {
  id: string;
  label: string;
  targetView: string;
  displayOrder: number;
  isVisible: boolean;
};

export type FooterGroup = {
  id: string;
  title: string;
  displayOrder: number;
  isVisible: boolean;
  links?: FooterLink[];
};

export type FooterLink = {
  id: string;
  groupId: string;
  label: string;
  targetView: string;
  displayOrder: number;
  isVisible: boolean;
};

export type FaqCategory = {
  id: string;
  slug: string;
  displayLabel: string;
  displayOrder: number;
  isVisible: boolean;
  faqs?: FaqItem[];
};

export type FaqItem = {
  id: string;
  faqCategoryId: string;
  question: string;
  answer: string;
  displayOrder: number;
  isVisible: boolean;
};

export type AboutPillar = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  displayOrder: number;
};

export type MediaAsset = {
  id: string;
  url: string;
  publicId: string;
  altText?: string;
  filename?: string;
  createdAt: string;
};

// Contact Inquiry Options
export type ContactInquiryOption = {
  id: string;
  value: string;
  label: string;
  displayOrder: number;
  isVisible: boolean;
};

// Amazon Modal Benefit
export type AmazonModalBenefit = {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  displayOrder: number;
  isVisible: boolean;
};

// --- API CLIENT ---

// Singletons (Public Reads)
export const getGlobalContent = async () => (await api.get<{ data: { content: GlobalSiteContent, navigation: NavigationItem[], footerGroups: FooterGroup[], amazonModalBenefits: AmazonModalBenefit[] } }>('/content/global')).data.data;
export const getHomeContent = async () => (await api.get<{ data: HomePageContent }>('/content/home')).data.data;
export const getProductsContent = async () => (await api.get<{ data: ProductsPageContent }>('/content/products')).data.data;
export const getAboutContent = async () => (await api.get<{ data: { content: AboutPageContent, pillars: AboutPillar[] } }>('/content/about')).data.data;
export const getContactContent = async () => (await api.get<{ data: { content: ContactPageContent, inquiryOptions: ContactInquiryOption[] } }>('/content/contact')).data.data;
export const getFaqContent = async () => (await api.get<{ data: { content: FaqPageContent, categories: FaqCategory[] } }>('/content/faq')).data.data;

// Singletons (Admin Writes)
export const upsertGlobalContent = async (data: Partial<GlobalSiteContent>) => (await api.put('/admin/content/global', data)).data.data;
export const upsertHomeContent = async (data: Partial<HomePageContent>) => (await api.put('/admin/content/home', data)).data.data;
export const upsertProductsContent = async (data: Partial<ProductsPageContent>) => (await api.put('/admin/content/products', data)).data.data;
export const upsertAboutContent = async (data: Partial<AboutPageContent>) => (await api.put('/admin/content/about', data)).data.data;
export const upsertContactContent = async (data: Partial<ContactPageContent>) => (await api.put('/admin/content/contact', data)).data.data;
export const upsertFaqContent = async (data: Partial<FaqPageContent>) => (await api.put('/admin/content/faq', data)).data.data;

// Repeatables (Admin CRUD)

// Navigation
export const getNavigations = async () => (await api.get<{ data: NavigationItem[] }>('/admin/navigation')).data.data;
export const createNavigation = async (data: Partial<NavigationItem>) => (await api.post('/admin/navigation', data)).data.data;
export const updateNavigation = async ({ id, data }: { id: string; data: Partial<NavigationItem> }) => (await api.put(`/admin/navigation/${id}`, data)).data.data;
export const deleteNavigation = async (id: string) => (await api.delete(`/admin/navigation/${id}`)).data.data;

// Footer Groups
export const getFooterGroups = async () => (await api.get<{ data: FooterGroup[] }>('/admin/footer/groups')).data.data;
export const createFooterGroup = async (data: Partial<FooterGroup>) => (await api.post('/admin/footer/groups', data)).data.data;
export const updateFooterGroup = async ({ id, data }: { id: string; data: Partial<FooterGroup> }) => (await api.put(`/admin/footer/groups/${id}`, data)).data.data;
export const deleteFooterGroup = async (id: string) => (await api.delete(`/admin/footer/groups/${id}`)).data.data;

// Footer Links
export const createFooterLink = async (data: Partial<FooterLink>) => (await api.post('/admin/footer/links', data)).data.data;
export const updateFooterLink = async ({ id, data }: { id: string; data: Partial<FooterLink> }) => (await api.put(`/admin/footer/links/${id}`, data)).data.data;
export const deleteFooterLink = async (id: string) => (await api.delete(`/admin/footer/links/${id}`)).data.data;

// FAQ Categories
export const getFaqCategories = async () => (await api.get<{ data: FaqCategory[] }>('/admin/faqs/categories')).data.data;
export const createFaqCategory = async (data: Partial<FaqCategory>) => (await api.post('/admin/faqs/categories', data)).data.data;
export const updateFaqCategory = async ({ id, data }: { id: string; data: Partial<FaqCategory> }) => (await api.put(`/admin/faqs/categories/${id}`, data)).data.data;
export const deleteFaqCategory = async (id: string) => (await api.delete(`/admin/faqs/categories/${id}`)).data.data;

// FAQ Items
export const createFaqItem = async (data: Partial<FaqItem>) => (await api.post('/admin/faqs/items', data)).data.data;
export const updateFaqItem = async ({ id, data }: { id: string; data: Partial<FaqItem> }) => (await api.put(`/admin/faqs/items/${id}`, data)).data.data;
export const deleteFaqItem = async (id: string) => (await api.delete(`/admin/faqs/items/${id}`)).data.data;

// About Pillars
export const getAboutPillars = async () => (await api.get<{ data: AboutPillar[] }>('/admin/about/pillars')).data.data;
export const createAboutPillar = async (data: Partial<AboutPillar>) => (await api.post('/admin/about/pillars', data)).data.data;
export const updateAboutPillar = async ({ id, data }: { id: string; data: Partial<AboutPillar> }) => (await api.put(`/admin/about/pillars/${id}`, data)).data.data;
export const deleteAboutPillar = async (id: string) => (await api.delete(`/admin/about/pillars/${id}`)).data.data;

// Media Assets
export const getMediaAssets = async () => (await api.get<{ data: MediaAsset[] }>('/admin/media')).data.data;
export const createMediaAsset = async (data: Partial<MediaAsset>) => (await api.post('/admin/media', data)).data.data;
export const updateMediaAsset = async ({ id, data }: { id: string; data: Partial<MediaAsset> }) => (await api.put(`/admin/media/${id}`, data)).data.data;
export const deleteMediaAsset = async (id: string) => (await api.delete(`/admin/media/${id}`)).data.data;

// Contact Inquiry Options
export const getContactInquiryOptions = async () => (await api.get<{ data: ContactInquiryOption[] }>('/admin/contact/inquiry-options')).data.data;
export const createContactInquiryOption = async (data: Partial<ContactInquiryOption>) => (await api.post('/admin/contact/inquiry-options', data)).data.data;
export const updateContactInquiryOption = async ({ id, data }: { id: string; data: Partial<ContactInquiryOption> }) => (await api.put(`/admin/contact/inquiry-options/${id}`, data)).data.data;
export const deleteContactInquiryOption = async (id: string) => (await api.delete(`/admin/contact/inquiry-options/${id}`)).data.data;

// Amazon Modal Benefits
export const getAmazonModalBenefits = async () => (await api.get<{ data: AmazonModalBenefit[] }>('/admin/amazon-modal-benefits')).data.data;
export const createAmazonModalBenefit = async (data: Partial<AmazonModalBenefit>) => (await api.post('/admin/amazon-modal-benefits', data)).data.data;
export const updateAmazonModalBenefit = async ({ id, data }: { id: string; data: Partial<AmazonModalBenefit> }) => (await api.put(`/admin/amazon-modal-benefits/${id}`, data)).data.data;
export const deleteAmazonModalBenefit = async (id: string) => (await api.delete(`/admin/amazon-modal-benefits/${id}`)).data.data;
