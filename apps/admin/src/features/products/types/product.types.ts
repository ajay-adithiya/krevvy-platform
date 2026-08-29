import { Category } from "@/features/categories/types/category.types";

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  amazonUrl?: string;

  isFeatured: boolean;
  isActive: boolean;

  categoryId: string;
  category?: Category;
  tagline?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  discountLabel?: string;
  ratingDisplay?: string;
  reviewCountDisplay?: string;
  primaryColorAccent?: string;
  amazonButtonLabel?: string;
  displayOrder?: number;
  createdAt: string;

  images?: {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
  }[];
}