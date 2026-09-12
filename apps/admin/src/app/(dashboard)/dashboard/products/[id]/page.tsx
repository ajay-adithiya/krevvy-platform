"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "@/features/products/components/product-form";
import { useProduct } from "@/features/products/hooks/use-product";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading, error } = useProduct(productId);

  const handleSuccess = () => {
    // Optionally redirect back to list, or just stay on edit page
    // router.push("/dashboard/products");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load product or product not found.</p>
        <Link href="/dashboard/products" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            {product.name}
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <ProductForm mode="edit" product={product} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
