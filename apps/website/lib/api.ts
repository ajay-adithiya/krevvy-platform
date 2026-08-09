import { ApiResponse, Product, Category } from "../types";

const API_BASE_URL = "http://localhost:5000/api/v1";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status, res.statusText);
      return [];
    }

    const json = (await res.json()) as ApiResponse<Product[]>;
    return json.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch categories:", res.status, res.statusText);
      return [];
    }

    const json = (await res.json()) as ApiResponse<Category[]>;
    return json.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
