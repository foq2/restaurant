import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/order",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getOrders() {
  return await axiosInstance.get("/");
}

export async function getOrder(id) {
  return await axiosInstance.get(`/${id}`);
}

export async function addOrder(order) {
  return await axiosInstance.post("/", order);
}

export async function updateOrder(id, order) {
  return await axiosInstance.put(`/${id}`, order);
}

export async function deleteOrder(id) {
  return await axiosInstance.delete(`/${id}`);
}
