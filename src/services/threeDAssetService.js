import API from "./api";

export const getProductThreeDAsset = async (productId) => {
  try {
    const response = await API.get(`/products/${productId}/3d`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        success: false,
        asset: null,
        unavailable: true,
      };
    }

    throw error;
  }
};

export const getThreeDAsset = async (id) => {
  const response = await API.get(`/3d-assets/${id}`);
  return response.data;
};

export const getAllThreeDAssets = async () => {
  const response = await API.get("/3d-assets");
  return response.data;
};

export const reviewThreeDAsset = async (id, data) => {
  const response = await API.put(
    `/3d-assets/${id}/review`,
    data,
  );

  return response.data;
};