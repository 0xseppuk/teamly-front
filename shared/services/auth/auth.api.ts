import { axiosInstanse } from '../axios';

import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
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

export async function forgotPassword(
  data: ForgotPasswordRequest,
  recaptchaToken: string,
) {
  const response = await axiosInstanse.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    data,
    {
      headers: {
        'X-Recaptcha-Token': recaptchaToken,
      },
    },
  );

  return response.data;
}

export async function resetPassword(data: ResetPasswordRequest) {
  const response = await axiosInstanse.post<ResetPasswordResponse>(
    '/auth/reset-password',
    data,
  );

  return response.data;
}
