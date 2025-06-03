import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/user",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export async function getEmployees() {
  return await axiosInstance.get("/");
}

export async function addEmployee(employee) {
  return await axiosInstance.post("/", employee);
}

export async function updateEmployee(id, employee) {
  return await axiosInstance.put("/" + id, employee);
}

export async function deleteEmployee(id) {
  return await axiosInstance.delete("/" + id);
}

export async function getEmployee(id) {
  return await axiosInstance.get("/" + id);
}
