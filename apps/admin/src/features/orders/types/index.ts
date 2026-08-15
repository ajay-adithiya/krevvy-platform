export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  priceAtTime: number;
  quantity: number;
  orderId: string;
}

export interface OrderListDto {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  isPaid: boolean;
  totalAmount: number;
  createdAt: string;
  razorpayOrderId: string | null;
}

export interface OrderDetailsDto extends OrderListDto {
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  subTotal: number;
  tax: number;
  shippingFee: number;
  razorpayPaymentId: string | null;
  paidAt: string | null;
  paymentError: string | null;
  expiresAt: string | null;
  items: OrderItem[];
  updatedAt: string;
}

export interface OrderListResponse {
  data: OrderListDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
