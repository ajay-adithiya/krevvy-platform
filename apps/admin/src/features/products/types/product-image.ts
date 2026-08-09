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