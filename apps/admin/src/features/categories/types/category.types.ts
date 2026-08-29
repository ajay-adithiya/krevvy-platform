export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayLabel?: string;
  iconName?: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}