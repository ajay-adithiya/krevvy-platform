import { Product } from "../../types";
import { ProductCard } from "../products/product-card";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Filter for featured and active products
  const featuredProducts = products
    .filter((product) => product.isActive && product.isFeatured)
    .slice(0, 4); // Limit to 4 for homepage

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Featured Products</h2>
          <p className="mt-4 text-foreground/70 max-w-2xl">
            Our most popular and highly rated products, selected just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
