import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/order",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export async function getOrders(searchTerm, status, date) {
  return await axiosInstance.get(
    `/?searchTerm=${searchTerm}&status=${status}&date=${date}`
  );
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
