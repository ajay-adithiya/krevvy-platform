import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteProduct } from "../api/update-product.api";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Product deleted successfully.");
    },

    onError: () => {
      toast.error("Failed to delete product.");
    },
  });
}