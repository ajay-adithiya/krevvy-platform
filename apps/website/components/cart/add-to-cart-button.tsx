"use client";

import { useCartStore } from "../../store/cart.store";
import { Product } from "../../types";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function AddToCartButton({ product, className = "", variant = "primary" }: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.imageUrl || "https://placehold.co/600x600?text=No+Image";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl,
    });
  };

  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors";
  const variants = {
    primary: "bg-foreground text-background hover:bg-foreground/90 h-10 px-4 py-2",
    secondary: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground h-10 px-4 py-2",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button
      onClick={handleAddToCart}
      className={combinedClasses}
      aria-label={`Add ${product.name} to cart`}
    >
      Add to Cart
    </button>
  );
}
