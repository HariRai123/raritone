import API from "./api";

export const analyzeTryOn = async (image) => {
  const formData = new FormData();

  formData.append("image", image);

  const response = await API.post("/tryon/analyze", formData);

  return response.data;
};

export const createTryOn = async ({ image, productId }) => {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("productId", productId);

  const response = await API.post("/tryon/session", formData);

  return response.data;
};

export const getTryOnSession = async (id) => {
  const response = await API.get(`/tryon/session/${id}`);

  return response.data;
};

export const retryTryOn = async (id) => {
  const response = await API.post(`/tryon/session/${id}/retry`);

  return response.data;
};

export const getTryOnHistory = async (page = 1, limit = 10) => {
  const response = await API.get(
    `/tryon/history?page=${page}&limit=${limit}`,
  );

  return response.data;
};

export const getTryOnHistoryById = async (id) => {
  return getTryOnSession(id);
};

export const getMyTryOnResults = async (page = 1, limit = 10) => {
  return getTryOnHistory(page, limit);
};