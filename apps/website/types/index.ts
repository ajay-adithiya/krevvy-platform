export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  publicId: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  stock: number;
  amazonUrl?: string;

  isFeatured: boolean;
  isActive: boolean;

  categoryId: string;
  category: Category;

  images: ProductImage[];

  createdAt: string;
  updatedAt: string;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface ValidateCheckoutResponse {
  subTotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    subTotal: number;
  }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  subTotal: string | number; // Prisma Decimal comes as string over JSON
  tax: string | number;
  shippingFee: string | number;
  totalAmount: string | number;
  status: string;
  isPaid: boolean;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  paidAt?: string | null;
  paymentError?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}
