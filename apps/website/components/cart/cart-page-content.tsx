"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cart.store";
import { CartItemComponent } from "./cart-item";
import { CartSummary } from "./cart-summary";

export function CartPageContent() {
  const [mounted, setMounted] = useState(false);
  const { items } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-muted h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-muted rounded col-span-2"></div>
                <div className="h-2 bg-muted rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-card border rounded-2xl p-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground mb-6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-foreground/70 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our premium products and elevate your everyday living.
        </p>
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Explore Our Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8">
        <div className="bg-card border rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Cart Items</h2>
          <div className="flex flex-col">
            {items.map((item) => (
              <CartItemComponent key={item.productId} item={item} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
