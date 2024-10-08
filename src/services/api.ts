// src/services/api.ts

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Define TypeScript interfaces for response data
interface LoginResponse {
  token: string;
  message?: string;
}

interface RegisterResponse {
  message: string;
}

interface DeactivateResponse {
  message: string;
}

// Load environment variables safely with a fallback
const AUTH_API_URL = import.meta.env.AUTH_API_URL || "http://localhost:5000/api/auth";

// Create an Axios instance with default configurations
const api: AxiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout to prevent hanging requests
});

// Request interceptor for adding headers or logging requests
api.interceptors.request.use(
  (config) => {
    // config.headers["X-Custom-Header"] = "CustomValue";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      const { status, data } = error.response;
      // Customize error messages based on status codes
      let errorMessage = "An error occurred";

      if (data && typeof data === "object") {
        errorMessage = data.error || data.message || errorMessage;
      }

      switch (status) {
        case 400:
          errorMessage = data?.message || "Bad Request";
          break;
        case 401:
          errorMessage = data?.message || "Unauthorized. Please check your credentials.";
          break;
        case 403:
          errorMessage = data?.message || "Forbidden. You don't have permission to perform this action.";
          break;
        case 404:
          errorMessage = data?.message || "Not Found. The requested resource does not exist.";
          break;
        case 500:
          errorMessage = data?.message || "Internal Server Error. Please try again later.";
          break;
        default:
          errorMessage = data?.message || `Unexpected error with status code ${status}`;
      }

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error("No response from server. Please check your network connection."));
    } else {
      // Something happened in setting up the request
      return Promise.reject(new Error(`Request setup failed: ${error.message}`));
    }
  }
);

/**
 * Sets or removes the Authorization token in Axios headers.
 * @param token - JWT token string or null to remove the token.
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

/**
 * Handles API errors by logging them and optionally integrating with a notification system.
 * @param error - The error object thrown by Axios.
 */
const handleApiError = (error: Error): void => {
  console.error("API Error:", error.message);
  // TODO: Integrate with a notification system (e.g., toast notifications) if desired.
};

/**
 * Registers a new user.
 * @param email - User's email address.
 * @param password - User's password.
 * @param firstName - User's first name.
 * @param lastName - User's last name.
 * @param username - Desired username.
 * @returns A promise resolving to the registration response data.
 */
export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username: string
): Promise<RegisterResponse> => {
  try {
    const response: AxiosResponse<RegisterResponse> = await api.post("/register", {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      username,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      handleApiError(error);
      throw error;
    }
    throw new Error("An unknown error occurred during registration.");
  }
};

/**
 * Logs in a user.
 * @param username - User's username.
 * @param password - User's password.
 * @returns A promise resolving to the login response data.
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post("/login", {
      username,
      password,
    });
    const { token, message } = response.data;
    // Store the token securely. localStorage is vulnerable to XSS attacks.
    // Consider using HTTP-only cookies for better security.
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);
    return { token, message };
  } catch (error) {
    if (error instanceof Error) {
      handleApiError(error);
      throw error;
    }
    throw new Error("An unknown error occurred during login.");
  }
};

/**
 * Deactivates a user's account.
 * @param username - User's username.
 * @param password - User's password.
 * @returns A promise resolving to the deactivation response data.
 */
export const deactivate = async (username: string, password: string): Promise<DeactivateResponse> => {
  try {
    const response: AxiosResponse<DeactivateResponse> = await api.post("/deactivate-account", {
      username,
      password,
    });
    // Optionally, remove the token upon deactivation
    localStorage.removeItem("jwtToken");
    setAuthToken(null);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      handleApiError(error);
      throw error;
    }
    throw new Error("An unknown error occurred during account deactivation.");
  }
};

export default api;
