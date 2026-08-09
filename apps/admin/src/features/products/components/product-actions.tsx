"use client";

import { Button } from "@/components/ui/button";

import { EditProductDialog } from "./edit-product-dialog";

import { Product } from "../types/product.types";
import { useDeleteProduct } from "../hooks/use-delete-product";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({
  product,
}: ProductActionsProps) {
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(product.id);
  };

  return (
    <div className="flex items-center gap-2">
      <EditProductDialog product={product} />

      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        Delete
      </Button>
    </div>
  );
}