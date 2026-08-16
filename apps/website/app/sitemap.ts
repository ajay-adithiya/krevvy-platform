import { MetadataRoute } from 'next';
import { getProducts } from '../lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krevvy.com';

  let products: any[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  const staticRoutes = ['', '/about', '/contact', '/products'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const productRoutes = products
    .filter((p: any) => p.isActive)
    .map((product: any) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...productRoutes];
}
