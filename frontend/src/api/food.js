import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/food",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export async function getFoods() {
  return await axiosInstance.get("/");
}

export async function getFood(id) {
  return await axiosInstance.get(`/${id}`);
}

export async function addFood(food) {
  return await axiosInstance.post("/", food);
}

export async function updateFood(id, food) {
  return await axiosInstance.put(`/${id}`, food);
}

export async function deleteFood(id) {
  return await axiosInstance.delete(`/${id}`);
}
