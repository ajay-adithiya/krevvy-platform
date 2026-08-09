import api from "@/lib/api";

export async function getProductImages(productId: string) {
  const response = await api.get(`/products/${productId}/images`);
  return response.data.data;
}

export async function uploadProductImage(
  productId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post(
    `/products/${productId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
}

export async function updateProductImage(
  productId: string,
  imageId: string,
  data: {
    altText?: string;
    displayOrder?: number;
  },
) {
  const response = await api.patch(
    `/products/${productId}/images/${imageId}`,
    data,
  );

  return response.data.data;
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string,
) {
  const response = await api.patch(
    `/products/${productId}/images/${imageId}/primary`,
  );

  return response.data.data;
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
) {
  const response = await api.delete(
    `/products/${productId}/images/${imageId}`,
  );

  return response.data;
}