import api from "@/lib/api";

export async function getProducts() {
  const response = await api.get("/products");

  return response.data.data;
}

export async function createProduct(data: CreateProductDto) {
  console.log("Sending payload:", data);

  const response = await api.post("/products", data);

  console.log("Response:", response.data);

  return response.data.data;
}

export interface CreateProductDto {
  name: string;
  shortDescription?: string;
  description: string;
  price: number;
  amazonUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  categoryId: string;
}