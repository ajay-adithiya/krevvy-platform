import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateProduct,
} from "../api/update-product.api";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: any;
    }) => updateProduct(productId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}