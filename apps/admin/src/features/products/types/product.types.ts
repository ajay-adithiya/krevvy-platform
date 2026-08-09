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

  category: {
    id: string;
    name: string;
  };

  images?: {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
  }[];
}