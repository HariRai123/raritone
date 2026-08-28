import API from "./api";

export const createOrder = async ({
  items,
  shippingAddress,
  paymentMethod = "online",
}) => {
  console.log("SENDING TO BACKEND:", {
    items,
    shippingAddress,
    paymentMethod,
  });

  const response = await API.post("/orders", {
    items,
    shippingAddress,
    paymentMethod,
  });

  return response.data;
};

export const getMyOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

export const getAllOrders = async () => {
  const response = await API.get("/admin/orders");
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await API.patch(
    `/admin/orders/${orderId}`,
    { status }
  );

  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);

  return response.data;
};