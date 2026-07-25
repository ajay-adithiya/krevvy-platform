import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../api/product.service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}