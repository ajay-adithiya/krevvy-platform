import api from "@/lib/api";
import { OrderDetailsDto, OrderListResponse, OrderStatus } from "../types";

export async function getOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "ALL";
  isPaid?: boolean | string;
}): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);
  if (params.status && params.status !== "ALL") query.append("status", params.status);
  if (params.isPaid !== undefined && params.isPaid !== "ALL") query.append("isPaid", params.isPaid.toString());

  const response = await api.get(`/orders?${query.toString()}`);
  // Returning the whole response data because our API returns { data, pagination }
  return response.data;
}

export async function getOrder(id: string): Promise<OrderDetailsDto> {
  const response = await api.get(`/orders/${id}`);
  // Returning response.data because getOrderById returns the object directly, not wrapped in {data: ...}
  return response.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDetailsDto> {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
}
