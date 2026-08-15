import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getOrder } from "../api/orders.service";
import { OrderDetailsDto } from "../types";

export function useOrder(id: string): UseQueryResult<OrderDetailsDto> {
  return useQuery<OrderDetailsDto>({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}
