import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getOrders } from "../api/orders.service";
import { OrderStatus, OrderListResponse } from "../types";

interface UseOrdersOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus | "ALL";
  isPaid?: boolean | string;
}

export function useOrders(options: UseOrdersOptions): UseQueryResult<OrderListResponse> {
  return useQuery<OrderListResponse>({
    queryKey: ["orders", options],
    queryFn: () => getOrders(options),
  });
}
