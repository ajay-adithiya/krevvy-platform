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

  category: {
    id: string;
    name: string;
  };
}