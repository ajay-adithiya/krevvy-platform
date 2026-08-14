"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "../../store/cart.store";

interface CartItemComponentProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <Link href={`/products/${item.slug}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
          unoptimized
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <Link href={`/products/${item.slug}`} className="font-medium text-sm line-clamp-2 hover:underline">
            {item.name}
          </Link>
          <span className="font-semibold text-sm whitespace-nowrap">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center rounded-md border bg-background text-sm">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-l-md"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              -
            </button>
            <span className="px-2 py-1 font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="px-2.5 py-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-md"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.productId)}
            className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
