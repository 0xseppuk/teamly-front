import { axiosInstanse } from '../axios';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './auth.types';

export async function login(data: LoginRequest, recaptchaToken: string) {
  const response = await axiosInstanse.post<LoginResponse>(
    '/auth/login',
    data,
    {
      withCredentials: true,
      headers: {
        'X-Recaptcha-Token': recaptchaToken,
      },
    },
  );

  return response.data;
}

export async function register(data: RegisterRequest, recaptchaToken: string) {
  const response = await axiosInstanse.post<RegisterResponse>(
    '/auth/register',
    data,
    {
      withCredentials: true,
      headers: {
        'X-Recaptcha-Token': recaptchaToken,
      },
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
