"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl max-w-lg w-full text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for shopping with Krevvy. Your order has been placed successfully and is now being processed.
      </p>
      
      {orderId && (
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-500 mb-1">Order Reference Number</p>
          <p className="text-lg font-bold text-gray-900 font-mono tracking-wider">{orderId}</p>
        </div>
      )}

      <Link
        href="/products"
        className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white p-8 md:p-12 rounded-2xl max-w-lg w-full text-center">
          Loading order details...
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
