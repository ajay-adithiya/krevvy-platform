import { ApiResponse, Product, Category } from "../types";
import { fetchWithAuth } from "./api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ApiResponse<Product[]>;
  return json.data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as ApiResponse<Category[]>;
  return json.data || [];
}

export async function validateCheckout(items: import('../types').CheckoutItem[]): Promise<import('../types').ValidateCheckoutResponse> {
  const res = await fetchWithAuth(`/orders/checkout/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Validation failed');
  }

  const json = await res.json();
  return json as import('../types').ValidateCheckoutResponse;
}

export async function createOrder(data: any): Promise<import('../types').Order> {
  const res = await fetchWithAuth(`/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Order creation failed');
  }

  const json = await res.json();
  return json as import('../types').Order;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyPayment(data: VerifyPaymentPayload): Promise<{ success: boolean; message: string; order: import('../types').Order }> {
  const res = await fetch(`${API_BASE_URL}/orders/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Payment verification failed');
  }

  return await res.json();
}
