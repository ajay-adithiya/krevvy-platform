import { Metadata } from "next";
import Image from "next/image";
import { getProducts } from "../../lib/api";
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
            {activeProducts.map((product: Product) => {
              const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
              const imageUrl = primaryImage?.imageUrl || "https://placehold.co/600x600?text=No+Image";

              return (
                <div key={product.id} id={product.id} className="group flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={primaryImage?.altText || product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized
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
                    
                    <p className="text-sm text-foreground/70 line-clamp-3 mb-6 flex-grow">
                      {product.description || product.shortDescription || "Premium Krevvy product."}
                    </p>
                    
                    <div className="mt-auto">
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
