import API from "./api";

export const getProducts = async () => {
  const response = await API.get("/products", {
    params: {
      _t: Date.now(),
    },
  });

  console.log("PRODUCT API RESPONSE:", response.data);

  return Array.isArray(response.data?.products)
    ? response.data.products
    : [];
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data.product;
};

export const createProduct = async (formData) => {
  const response = await API.post("/products", formData);
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await API.put(`/products/${id}`, formData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};