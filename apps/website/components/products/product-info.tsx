import { Product } from "../../types";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Category */}
      {product.category && (
        <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-2">
          {product.category.name}
        </p>
      )}

      {/* Title */}
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-4 text-foreground">
        {product.name}
      </h1>

      {/* Price */}
      <div className="text-2xl font-bold text-foreground mb-6">
        ${Number(product.price).toFixed(2)}
      </div>

      {/* Divider */}
      <hr className="my-6 border-muted" />

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-lg text-foreground/80 font-medium mb-6 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Detailed Description */}
      <div className="prose prose-sm sm:prose-base dark:prose-invert text-foreground/70 mb-8">
        <p className="whitespace-pre-line leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Actions (pushed to bottom if needed, though usually flow normally) */}
      <div className="mt-auto pt-8">
        {product.amazonUrl ? (
          <a
            href={product.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 w-full items-center justify-center rounded-md bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-foreground/90 shadow-sm"
          >
            Buy on Amazon
          </a>
        ) : (
          <button
            disabled
            className="inline-flex h-14 w-full items-center justify-center rounded-md bg-muted px-8 text-base font-medium text-muted-foreground cursor-not-allowed"
          >
            Currently Unavailable
          </button>
        )}
        
        {product.amazonUrl && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            You will be redirected to Amazon to securely complete your purchase.
          </p>
        )}
      </div>
    </div>
  );
}
