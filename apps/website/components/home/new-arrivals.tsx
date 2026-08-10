import { Product } from "../../types";
import { ProductCard } from "../products/product-card";

interface NewArrivalsProps {
  products: Product[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  // Filter for active products and sort by createdAt descending
  const newArrivals = products
    .filter((product) => product.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4); // Limit to 4 for homepage

  if (newArrivals.length === 0) {
    return null;
  }

  return (
    <section id="new-arrivals" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">New Arrivals</h2>
          <p className="mt-4 text-foreground/70 max-w-2xl">
            Discover the latest additions to our premium collection.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
