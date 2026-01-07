import { axiosInstanse } from '../axios';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.types';

export async function login(data: LoginRequest) {
  const response = await axiosInstanse.post<LoginResponse>(
    '/auth/login',
    data,
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await axiosInstanse.post<RegisterResponse>(
    '/auth/register',
    data,
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function logout() {
  const response = await axiosInstanse.post(
    '/auth/logout',
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
}
