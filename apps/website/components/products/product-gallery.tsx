"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "../../types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Find primary image or fallback to first image, or a placeholder if no images
  const initialPrimary = images?.find((img) => img.isPrimary) || images?.[0];
  const placeholderImage = { id: 'placeholder', imageUrl: "https://placehold.co/600x600?text=No+Image", altText: "No Image" } as ProductImage;
  
  const [activeImage, setActiveImage] = useState<ProductImage>(initialPrimary || placeholderImage);

  const displayImages = images && images.length > 0 ? images : [placeholderImage];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted w-full">
        <Image
          src={activeImage.imageUrl}
          alt={activeImage.altText || productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setActiveImage(image)}
              className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                activeImage.id === image.id ? "border-foreground" : "border-transparent hover:border-foreground/50"
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || `${productName} thumbnail`}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
