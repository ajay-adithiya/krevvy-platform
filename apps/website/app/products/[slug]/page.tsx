import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "../../../lib/api";
import { ProductGallery } from "../../../components/products/product-gallery";
import { ProductInfo } from "../../../components/products/product-info";
import { ProductCard } from "../../../components/products/product-card";
import Link from "next/link";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found | Krevvy",
    };
  }

  const description = product.shortDescription || product.description?.substring(0, 160) || "Premium Krevvy Product";
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.imageUrl || "https://placehold.co/600x600?text=No+Image";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krevvy.com';

  return {
    title: `${product.name} | Krevvy`,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Krevvy`,
      description,
      url: `/products/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: primaryImage?.altText || product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Krevvy`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const allProducts = await getProducts();
  const product = allProducts.find(p => p.slug === resolvedParams.slug) || null;

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter(p => p.isActive && p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krevvy.com';
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription,
    image: primaryImage?.imageUrl,
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="flex-1 bg-background pt-8 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 md:px-8">

        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm flex items-center space-x-2 text-muted-foreground">
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/products?category=${product.categoryId}`} className="hover:text-foreground transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="w-full">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>
          
          <div className="w-full">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
