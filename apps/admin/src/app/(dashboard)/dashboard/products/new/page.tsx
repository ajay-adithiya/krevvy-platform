"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "@/features/products/components/product-form";

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = (productId?: string) => {
    if (productId) {
      router.push(`/dashboard/products/${productId}`);
    } else {
      router.push("/dashboard/products");
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product. You can add images and features after saving the basic details.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <ProductForm mode="create" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
