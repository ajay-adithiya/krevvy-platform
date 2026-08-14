"use client";

import Link from "next/link";
import { useCartStore } from "../../store/cart.store";

export function CartSummary() {
  const { getSubtotal, getItemCount } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="bg-muted/30 rounded-lg p-6 border">
      <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping & Taxes</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-bold text-base text-foreground">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Link
        href="/cart"
        className="flex w-full items-center justify-center rounded-md bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
