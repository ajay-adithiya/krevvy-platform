"use client";

import { DataTable } from "@/components/ui/data-table";

import { useCategories } from "@/features/categories/hooks/use-categories";
import { categoryColumns } from "@/features/categories/components/category-columns";
import { CreateCategoryDialog } from "@/features/categories/components/create-category-dialog";

export default function CategoriesPage() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to load categories.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>

          <p className="text-muted-foreground">
            Manage your categories.
          </p>
        </div>

        <CreateCategoryDialog />
      </div>

      <DataTable
        columns={categoryColumns}
        data={data ?? []}
      />
    </div>
  );
}