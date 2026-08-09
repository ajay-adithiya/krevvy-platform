import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types";

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
          {featuredProducts.map((product) => {
            // Find primary image or fallback to first image
            const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
            const imageUrl = primaryImage?.imageUrl || "https://placehold.co/600x600?text=No+Image";

            return (
              <div key={product.id} className="group flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={primaryImage?.altText || product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized // Since images might come from external sources without configuration
                  />
                </div>
                
                <div className="flex flex-col p-6 flex-grow">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold tracking-tight text-lg line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="font-medium whitespace-nowrap">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  
                  {product.category && (
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                      {product.category.name}
                    </p>
                  )}
                  
                  <p className="text-sm text-foreground/70 line-clamp-2 mb-6 flex-grow">
                    {product.shortDescription || "Premium Krevvy product."}
                  </p>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    {product.amazonUrl ? (
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                      >
                        Buy on Amazon
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    )}
                    <Link
                      href={`/products#${product.id}`}
                      className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
