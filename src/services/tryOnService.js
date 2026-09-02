import API from "./api";

// Optional legacy/analysis endpoint
export const analyzeTryOn = async (image) => {
  const formData = new FormData();

  formData.append("person_image", image);

  const response = await API.post("/tryon/analyze", formData);

  return response.data;
};

// Create a new try-on session
export const createTryOn = async ({ image, productId }) => {
  if (!image) {
    throw new Error("Person image is required.");
  }

  if (!productId) {
    throw new Error("Product is required.");
  }

  const formData = new FormData();

  // IMPORTANT:
  // Backend multer expects "person_image"
  formData.append("person_image", image);

  formData.append("productId", productId);

  const response = await API.post("/tryon", formData);

  return response.data;
};

// Get a single try-on session
export const getTryOnSession = async (id) => {
  if (!id) {
    throw new Error("Try-on session ID is required.");
  }

  const response = await API.get(`/tryon/session/${id}`);

  return response.data;
};

// Retry a failed try-on
export const retryTryOn = async (id) => {
  if (!id) {
    throw new Error("Try-on session ID is required.");
  }

  const response = await API.post(`/tryon/session/${id}/retry`);

  return response.data;
};

// Get paginated try-on history
export const getTryOnHistory = async (page = 1, limit = 10) => {
  const response = await API.get(
    `/tryon/history?page=${page}&limit=${limit}`,
  );

  return response.data;
};

// Get a specific history/result
export const getTryOnHistoryById = async (id) => {
  return getTryOnSession(id);
};

// Get user's try-on results
export const getMyTryOnResults = async (page = 1, limit = 10) => {
  return getTryOnHistory(page, limit);
};