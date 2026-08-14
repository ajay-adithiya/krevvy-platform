"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../store/cart.store";
import { validateCheckout } from "../../lib/api";
import { ValidateCheckoutResponse } from "../../types";
import { CheckoutForm } from "../../components/checkout/checkout-form";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [validationData, setValidationData] = useState<ValidateCheckoutResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (items.length === 0) {
      setIsValidating(false);
      return;
    }

    const validate = async () => {
      try {
        setIsValidating(true);
        const checkoutItems = items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        }));
        
        const data = await validateCheckout(checkoutItems);
        setValidationData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to validate cart items");
        setValidationData(null);
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [items, isHydrated]);

  if (!isHydrated || isValidating) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to your cart before proceeding to checkout.</p>
        <Link href="/products" className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <CheckoutForm validationData={validationData} validationError={error} />
      </div>
    </div>
  );
}
