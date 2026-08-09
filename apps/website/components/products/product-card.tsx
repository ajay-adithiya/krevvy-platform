import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.imageUrl || "https://placehold.co/600x600?text=No+Image";

  return (
    <div className="group flex flex-col rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted block">
        <Image
          src={imageUrl}
          alt={primaryImage?.altText || product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          unoptimized // Remove if Next.js remotePatterns perfectly cover all image sources, but safe to keep for external unpredictable sources.
        />
      </Link>
      
      <div className="flex flex-col p-6 flex-grow">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-semibold tracking-tight text-lg line-clamp-2">
            <Link href={`/products/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
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
          {product.shortDescription || product.description || "Premium Krevvy product."}
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
            href={`/products/${product.slug}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
