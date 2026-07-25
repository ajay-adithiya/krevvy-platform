"use client";

import { DataTable } from "@/components/ui/data-table";

import { useProducts } from "@/features/products/hooks/use-products";
import { columns } from "@/features/products/components/product-columns";
import { CreateProductDialog } from "@/features/products/components/create-product-dialog";

export default function ProductsPage() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to load products.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>

          <p className="text-muted-foreground">
            Manage your products.
          </p>
        </div>

        <CreateProductDialog />
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
      />
    </div>
  );
}