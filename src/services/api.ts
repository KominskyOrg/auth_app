import axios from "axios";

const AUTH_API_URL = window.__ENV__?.AUTH_API_URL || "http://auth_api:5000";

const api = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set the Authorization header
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username: string
) => {
  return api.post("/register", {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    username,
  });
};

export const login = async (username: string, password: string) => {
  const response = await api.post("/login", {
    username,
    password,
  });
  const { token } = response.data;
  localStorage.setItem("jwtToken", token);
  setAuthToken(token);
  return response;
};

export const deactivate = async (username: string, password: string) => {
  const response = await api.post("/deactivate-account", {
    username,
    password,
  });
  return response;
};

export default api;
