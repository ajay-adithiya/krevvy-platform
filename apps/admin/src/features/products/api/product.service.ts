import api from "@/lib/api";

export async function getProducts() {
  const response = await api.get("/products");

  return response.data.data;
}

export async function createProduct(data: CreateProductDto) {
  try {
    console.log("Sending payload:", data);

    const response = await api.post("/products", data);

    console.log("Response:", response.data);

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Create Product Error:",
      error.response?.data,
    );

    throw error;
  }
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