import { Metadata } from "next";
import { getProducts } from "../../lib/api";
import { ProductCard } from "../../components/products/product-card";
import { Product } from "../../types";

export const metadata: Metadata = {
  title: "Products | Krevvy",
  description: "Browse the complete collection of Krevvy premium consumer products.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  const activeProducts = products.filter(p => p.isActive);

  return (
    <div className="flex-1 bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Our Collection
          </h1>
          <p className="mt-4 text-xl text-foreground/70 max-w-2xl">
            Explore our meticulously engineered products designed to elevate your everyday living.
          </p>
        </div>

        {activeProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold mb-2">No Products Available</h2>
            <p className="text-foreground/70">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
