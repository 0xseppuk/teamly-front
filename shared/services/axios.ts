import axios, { AxiosError, AxiosResponse } from 'axios';

export const axiosInstanse = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstanse.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Redirect to login on 401 Unauthorized

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
