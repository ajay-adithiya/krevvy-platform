import {
  GlobalSiteContent,
  NavigationItem,
  FooterGroup,
  HomePageContent,
  ProductsPageContent,
  AboutPageContent,
  AboutPillar,
  ContactPageContent,
  FaqPageContent,
  FaqCategory,
  CmsProduct,
  CmsCategory,
  ContactInquiryOption
} from '../types/cms';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  const json: ApiResponse<T> = await response.json();
  return json.data;
}

export const api = {
  getGlobalContent: () =>
    fetchApi<{ content: GlobalSiteContent | null; navigation: NavigationItem[]; footerGroups: FooterGroup[] }>('/content/global'),

  getHomeContent: () =>
    fetchApi<HomePageContent | null>('/content/home'),

  getProductsContent: () =>
    fetchApi<ProductsPageContent | null>('/content/products'),

  getAboutContent: () =>
    fetchApi<{ content: AboutPageContent | null; pillars: AboutPillar[] }>('/content/about'),

  getContactContent: () =>
    fetchApi<{ content: ContactPageContent | null; inquiryOptions: ContactInquiryOption[] }>('/content/contact'),

  getFaqContent: () =>
    fetchApi<{ content: FaqPageContent | null; categories: FaqCategory[] }>('/content/faq'),

  getProducts: () =>
    fetchApi<CmsProduct[]>('/products'),

  getCategories: () =>
    fetchApi<CmsCategory[]>('/categories'),
};
