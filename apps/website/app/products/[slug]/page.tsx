import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../lib/api";
import { ProductGallery } from "../../../components/products/product-gallery";
import { ProductInfo } from "../../../components/products/product-info";

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

  return {
    title: `${product.name} | Krevvy`,
    description: product.shortDescription || product.description?.substring(0, 160) || "Premium Krevvy Product",
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="flex-1 bg-background pt-8 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="w-full">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>
          
          <div className="w-full">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
