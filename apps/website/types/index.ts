export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  publicId: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

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
  category: Category;

  images: ProductImage[];

  createdAt: string;
  updatedAt: string;
}
