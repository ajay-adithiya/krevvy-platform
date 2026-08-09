"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

import {
  useProductImages,
  useUploadProductImage,
} from "../hooks/use-product-images";

interface ProductImagesProps {
  productId: string;
}

export function ProductImages({
  productId,
}: ProductImagesProps) {
  const {
    data: images = [],
    isLoading,
  } = useProductImages(productId);

  const uploadMutation =
    useUploadProductImage(productId);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    uploadMutation.mutate(file);

    event.target.value = "";
  };    

  if (isLoading) {
    return <p>Loading images...</p>;
  }

  return (
    <div className="space-y-4 border-t pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Product Images
        </h3>

        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
        />

        <Button
            type="button"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
        >
            {uploadMutation.isPending
                ? "Uploading..."
                : "Upload Image"}
        </Button>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No images uploaded.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded-lg border p-2"
            >
              <img
                src={image.imageUrl}
                alt={image.altText ?? "Product"}
                className="aspect-square w-full rounded object-cover"
              />

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs">
                  {image.isPrimary
                    ? "⭐ Primary"
                    : "Image"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}