import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krevvy.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/account/orders', '/checkout', '/cart'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
