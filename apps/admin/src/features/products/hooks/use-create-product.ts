import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createProduct,
  CreateProductDto,
} from "../api/product.service";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) =>
      createProduct(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product created successfully.");
    },

    onError: () => {
      toast.error("Failed to create product.");
    },
  });
}