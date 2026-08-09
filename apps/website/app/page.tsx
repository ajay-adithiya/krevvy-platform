import { Hero } from "../components/home/hero";
import { FeaturedProducts } from "../components/home/featured-products";
import { getProducts } from "../lib/api";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <FeaturedProducts products={products} />
    </>
  );
}
