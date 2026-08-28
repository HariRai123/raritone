import API from "./api";

let productsCache = null;
let productsRequest = null;

// Keep the catalog in memory for the current SPA session. This prevents
// Products, Try-On and other catalog consumers from requesting it again.
export const getProducts = async ({ force = false } = {}) => {
  if (!force && Array.isArray(productsCache)) return productsCache;
  if (!force && productsRequest) return productsRequest;

  productsRequest = API.get("/products")
    .then((response) => {
      productsCache = Array.isArray(response.data?.products)
        ? response.data.products
        : [];
      return productsCache;
    })
    .finally(() => {
      productsRequest = null;
    });

  return productsRequest;
};

export const invalidateProductsCache = () => {
  productsCache = null;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  const product = response.data.product;

  if (Array.isArray(productsCache)) {
    const index = productsCache.findIndex((item) => item._id === id);
    if (index >= 0) productsCache[index] = product;
  }

  return product;
};

export const createProduct = async (formData) => {
  const response = await API.post("/products", formData);
  invalidateProductsCache();
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await API.put(`/products/${id}`, formData);
  invalidateProductsCache();
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  invalidateProductsCache();
  return response.data;
};
