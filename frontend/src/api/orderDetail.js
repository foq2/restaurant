import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/order-detail",
  headers: { "Content-Type": "application/json" },
});

export async function getOrderDetailByOrderId(id) {
  return await axiosInstance.get(`/${id}`);
}

export async function addOrderDetail(orderDetail) {
  return await axiosInstance.post("/", orderDetail);
}

export async function updateOrderDetail(id, orderDetail) {
  return await axiosInstance.put(`/${id}`, orderDetail);
}

export async function deleteOrderDetail(id) {
  return await axiosInstance.delete(`/${id}`);
}
