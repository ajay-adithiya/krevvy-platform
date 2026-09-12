import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFeature,
  updateFeature,
  deleteFeature,
  createSpecification,
  updateSpecification,
  deleteSpecification,
} from "../api/product-repeatables.api";

export function useCreateFeature(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

export function useUpdateFeature(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateFeature(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

export function useDeleteFeature(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

export function useCreateSpecification(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createSpecification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

export function useUpdateSpecification(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSpecification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

export function useDeleteSpecification(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSpecification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}
