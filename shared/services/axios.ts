import axios, { AxiosError, AxiosResponse } from 'axios';

const TOKEN_KEY = 'auth_token';

export const axiosInstanse = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add Bearer token to all requests
axiosInstanse.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstanse.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const isAuthRequest =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    // If 401, clear token and redirect to login
    // BUT: skip if it's a login/register request (those should show validation errors)
    // AND: skip if already on auth pages
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/register') &&
      !isAuthRequest
    ) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export class ApiError extends Error {
  constructor(
    public response: Response,
    public message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
