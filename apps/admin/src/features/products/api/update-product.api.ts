import api from "@/lib/api";

export async function updateProduct(
  productId: string,
  data: any,
) {
  const response = await api.patch(
    `/products/${productId}`,
    data,
  );

  return response.data.data;
}

export async function deleteProduct(
  productId: string,
) {
  const response = await api.delete(
    `/products/${productId}`,
  );

  return response.data;
}