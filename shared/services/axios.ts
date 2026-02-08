import axios, { AxiosError, AxiosResponse } from 'axios';

export const axiosInstanse = axios.create({
  // Используем относительный URL - запросы идут через Next.js прокси
  // Это решает проблему с cross-origin cookies на localhost
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для отправки HTTP-only cookies
});

// Response interceptor
axiosInstanse.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const isAuthRequest =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    const publicPages = ['/games', '/application', '/'];

    const isOnPublicPage =
      typeof window !== 'undefined' &&
      publicPages.some((page) => window.location.pathname.startsWith(page));

    // If 401, redirect to login
    // BUT: skip if it's a login/register request (those should show validation errors)
    // AND: skip if already on auth pages
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/register') &&
      !window.location.pathname.startsWith('/forgot-password') &&
      !window.location.pathname.startsWith('/reset-password') &&
      !isAuthRequest &&
      !isOnPublicPage
    ) {
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
