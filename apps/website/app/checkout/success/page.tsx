"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
interface ConfirmationData {
  orderNumber: string;
  status: string;
  totalAmount: number;
  paidAt: string | null;
}

export default function CheckoutSuccessPage() {
  const [data, setData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("krevvy_order_confirmation");
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      // Ignore parse errors, just fail gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl max-w-lg w-full text-center shadow-sm">
          Loading order details...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl max-w-lg w-full text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmation Unavailable</h1>
          <p className="text-gray-600 mb-8">
            We couldn't retrieve your recent order details for this session. If you successfully completed a payment, please check your email for the order receipt.
          </p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl max-w-lg w-full text-center shadow-sm border border-gray-100">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for shopping with Krevvy. Your order has been placed successfully.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-4 border border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-lg font-bold text-gray-900 font-mono tracking-wider">{data.orderNumber}</p>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-900">{data.status === "PAID" ? "Paid & Confirmed" : data.status}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="font-medium text-gray-900">₹{data.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          {data.paidAt && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">Payment Date</p>
              <p className="font-medium text-gray-900">{new Date(data.paidAt).toLocaleString()}</p>
            </div>
          )}
        </div>

        <Link
          href="/products"
          className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
