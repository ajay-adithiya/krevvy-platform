import api from "@/lib/api";

export async function getCategories() {
  const response = await api.get("/categories");
  return response.data.data;
}

export async function createCategory(data: unknown) {
  const response = await api.post("/categories", data);
  return response.data.data;
}

export async function updateCategory(id: string, data: unknown) {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data.data;
}

export async function deleteCategory(id: string) {
  const response = await api.delete(`/categories/${id}`);
  return response.data.data;
}