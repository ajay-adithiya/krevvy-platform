import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteProductImage,
  getProductImages,
  setPrimaryProductImage,
  updateProductImage,
  uploadProductImage,
} from "../api/product-image.api";

export function useProductImages(productId: string) {
  return useQuery({
    queryKey: ["product-images", productId],
    queryFn: () => getProductImages(productId),
    enabled: !!productId,
  });
}

export function useUploadProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      uploadProductImage(productId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", productId],
      });
    },
  });
}

export function useUpdateProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageId,
      data,
    }: {
      imageId: string;
      data: {
        altText?: string;
        displayOrder?: number;
      };
    }) =>
      updateProductImage(productId, imageId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", productId],
      });
    },
  });
}

export function useSetPrimaryProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      setPrimaryProductImage(productId, imageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", productId],
      });
    },
  });
}

export function useDeleteProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      deleteProductImage(productId, imageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-images", productId],
      });
    },
  });
}