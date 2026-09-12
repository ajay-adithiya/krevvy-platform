import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createProduct,
  CreateProductDto,
} from "../api/product.service";

export function useCreateProduct(onSuccessCb?: (productId: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) =>
      createProduct(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product created successfully.");

      if (onSuccessCb && data?.id) {
        onSuccessCb(data.id);
      }
    },

    onError: () => {
      toast.error("Failed to create product.");
    },
  });
}