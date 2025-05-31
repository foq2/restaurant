import axios from "axios";

const API_URL = "http://localhost:4000/auth/";

export async function login(user) {
  return await axios
    .post(API_URL + "login", user, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      localStorage.setItem("user", JSON.stringify(response.data));
    });
}

export function logout() {
  localStorage.removeItem("user");
}

export async function register(user) {
  return await axios
    .post(API_URL + "register", user, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      localStorage.setItem("user", JSON.stringify(response.data));
    });
}
