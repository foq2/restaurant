import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/auth/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export async function login(user) {
  try {
    const response = await axiosInstance.post("login", user);
    localStorage.setItem("user", JSON.stringify(response.data));
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

export function logout() {
  localStorage.removeItem("user");
}

export async function register(user) {
  try {
    const response = await axiosInstance.post("register", user);
    localStorage.setItem("user", JSON.stringify(response.data));
  } catch (error) {
    console.error("Registration failed:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}
