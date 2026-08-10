import { Metadata } from "next";
import { getProducts, getCategories } from "../../lib/api";
import { ProductBrowser } from "../../components/products/product-browser";
import { Product } from "../../types";

export const metadata: Metadata = {
  title: "Products | Krevvy",
  description: "Browse the complete collection of Krevvy premium consumer products.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  const activeProducts = products.filter(p => p.isActive);
  const activeCategories = categories.filter(c => c.isActive);

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

        <ProductBrowser 
          initialProducts={activeProducts} 
          categories={activeCategories} 
        />
      </div>
    </div>
  );
}
