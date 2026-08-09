import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Krevvy",
  description: "Learn more about Krevvy and our mission to elevate the Indian lifestyle.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-24 md:py-32 md:px-8 max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-8">
          Our Story
        </h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-xl text-foreground/80 leading-relaxed mb-6">
            Krevvy was born from a simple belief: the modern Indian lifestyle deserves uncompromising quality.
          </p>
          <p className="text-foreground/70 leading-relaxed mb-6">
            We are a dedicated consumer product brand focusing on innovative, thoughtfully designed goods that elevate everyday living. From essential tools to premium appliances, every Krevvy product undergoes meticulous engineering to ensure it meets our exacting standards for durability, functionality, and aesthetic appeal.
          </p>
          <p className="text-foreground/70 leading-relaxed mb-8">
            Our team is passionate about bridging the gap between premium global design and local utility. We don't just sell products; we deliver experiences that integrate seamlessly into your home.
          </p>
          
          <div className="bg-muted p-8 rounded-2xl mt-12">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start">
                <span className="mr-3 font-bold text-foreground">•</span>
                <span><strong>Premium Quality:</strong> Materials and construction built to last.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 font-bold text-foreground">•</span>
                <span><strong>Modern Aesthetics:</strong> Minimalist, clean designs.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 font-bold text-foreground">•</span>
                <span><strong>Customer First:</strong> Reliable support and honest communication.</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-12">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
