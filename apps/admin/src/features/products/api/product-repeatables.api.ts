import api from "@/lib/api";

export async function createFeature(data: any) {
  const response = await api.post("/admin/products/features", data);
  return response.data.data;
}

export async function updateFeature(id: string, data: any) {
  const response = await api.put(`/admin/products/features/${id}`, data);
  return response.data.data;
}

export async function deleteFeature(id: string) {
  const response = await api.delete(`/admin/products/features/${id}`);
  return response.data.data;
}

export async function createSpecification(data: any) {
  const response = await api.post("/admin/products/specifications", data);
  return response.data.data;
}

export async function updateSpecification(id: string, data: any) {
  const response = await api.put(`/admin/products/specifications/${id}`, data);
  return response.data.data;
}

export async function deleteSpecification(id: string) {
  const response = await api.delete(`/admin/products/specifications/${id}`);
  return response.data.data;
}
