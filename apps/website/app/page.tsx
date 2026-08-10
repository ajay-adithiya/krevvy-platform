import { Hero } from "../components/home/hero";
import { FeaturedProducts } from "../components/home/featured-products";
import { NewArrivals } from "../components/home/new-arrivals";
import { CategoriesSection } from "../components/home/categories-section";
import { getProducts, getCategories } from "../lib/api";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      <FeaturedProducts products={products} />
      <NewArrivals products={products} />
      <CategoriesSection categories={categories} />
    </main>
  );
}
