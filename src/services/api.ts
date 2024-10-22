// src/services/api.ts

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Define TypeScript interfaces for response data
export interface LoginResponse {
  token: string;
  message?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface DeactivateResponse {
  status: number; // Added status
  message: string;
}

// Load environment variables safely with a fallback
const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/auth';

// Create an Axios instance with default configurations
const api: AxiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
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
    // Handle errors globally
    return Promise.reject(error);
  }
);

/**
 * Sets or removes the Authorization token in Axios headers.
 * @param token - JWT token string or null to remove the token.
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Handles API errors by logging them and optionally integrating with a notification system.
 * @param error - The error object thrown by Axios.
 */
const handleApiError = (error: Error): void => {
  console.error('API Error:', error.message);
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
    const response: AxiosResponse<RegisterResponse> = await api.post(
      '/register',
      {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        username,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      handleApiError(error);
      throw error;
    }
    throw new Error('An unknown error occurred during registration.');
  }
};

/**
 * Logs in a user.
 * @param username - User's username.
 * @param password - User's password.
 * @returns A promise resolving to the login response data.
 */
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await api.post('/login', {
      username,
      password,
    });
    const { token, message } = response.data;
    // Store the token securely. localStorage is vulnerable to XSS attacks.
    // Consider using HTTP-only cookies for better security.
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
    return { token, message };
  } catch (error) {
    if (error instanceof Error) {
      handleApiError(error);
      throw error;
    }
    throw new Error('An unknown error occurred during login.');
  }
};

/**
 * Deactivates a user's account.
 * @param username - User's username.
 * @param password - User's password.
 * @returns A promise resolving to the deactivation response data.
 */
export const deactivate = async (
  username: string,
  password: string
): Promise<DeactivateResponse> => {
  try {
    const response = await api.post('/deactivate', { username, password });
    return { status: response.status, message: response.data.message };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Deactivation failed.');
  }
};

export default api;
