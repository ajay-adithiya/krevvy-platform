"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ValidateCheckoutResponse } from "../../types";
import { useCartStore } from "../../store/cart.store";
import { useAuthStore } from "../../store/auth.store";
import { createOrder } from "../../lib/api";

interface CheckoutFormProps {
  validationData: ValidateCheckoutResponse | null;
  validationError: string | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function CheckoutForm({ validationData, validationError }: CheckoutFormProps) {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
    shippingAddressLine1: "",
    shippingAddressLine2: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "India",
  });

  // Keep it synced if user loads later
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        customerEmail: prev.customerEmail || user.email || "",
        customerPhone: prev.customerPhone || user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationData || loading) return;

    setLoading(true);
    setError(null);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your connection.");
      }

      let order = pendingOrder;

      // If we have a pending order, verify its authoritative backend status
      if (order && order.razorpayOrderId) {
        try {
          const statusRes = await fetch(`${API_BASE_URL}/orders/status/${order.razorpayOrderId}`)
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            const isExpired = statusData.expiresAt && new Date(statusData.expiresAt) < new Date();

            if (statusData.status !== 'PENDING_PAYMENT' || isExpired) {
              order = null; // Stale, failed, or expired. Discard it.
              setPendingOrder(null);
            }
          } else {
            order = null; // Fallback to recreate
          }
        } catch (e) {
          order = null; // Network error, recreate
        }
      }

      if (!order) {
        const orderPayload = {
          ...formData,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        };

        order = await createOrder(orderPayload);
        setPendingOrder(order);
      }

      if (!order.razorpayOrderId) {
        throw new Error("Razorpay order ID not received from server.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: Math.round(validationData.totalAmount * 100),
        currency: "INR",
        name: "Krevvy Platform",
        description: "Order Payment",
        order_id: order.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/orders/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              const confirmationData = {
                orderNumber: verifyData.order.orderNumber,
                status: verifyData.order.status,
                totalAmount: verifyData.order.totalAmount,
                paidAt: verifyData.order.paidAt,
              };
              sessionStorage.setItem('krevvy_order_confirmation', JSON.stringify(confirmationData));
              clearCart();
              router.push(`/checkout/success`);
            } else {
              setError("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch (err) {
            setError("Payment verification error.");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.customerName,
          email: formData.customerEmail,
          contact: formData.customerPhone,
        },
        theme: {
          color: "#16a34a", // Tailwind green-600
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message || "Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  if (validationError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Checkout Error</h3>
        <p>{validationError}</p>
      </div>
    );
  }

  if (!validationData) {
    return <div className="text-gray-500">Loading checkout details...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="customerName"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="customerEmail"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                value={formData.customerEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="customerPhone"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mt-6">Shipping Address</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input
                type="text"
                name="shippingAddressLine1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                value={formData.shippingAddressLine1}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="shippingAddressLine2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                value={formData.shippingAddressLine2}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="shippingCity"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  value={formData.shippingCity}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="shippingState"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  value={formData.shippingState}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="shippingPostalCode"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  value={formData.shippingPostalCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="shippingCountry"
                  value="India"
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg outline-none text-gray-500"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 sticky top-24">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {validationData.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-gray-900">₹{item.subTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{validationData.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>
                {validationData.shippingFee === 0
                  ? "Free"
                  : `₹${validationData.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (GST)</span>
              <span>₹{validationData.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>₹{validationData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
