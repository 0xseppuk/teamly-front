import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '../axios';

import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
} from './auth.api';
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

type LoginMutationVars = {
  data: LoginRequest;
  recaptchaToken: string;
};

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: LoginResponse) => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, recaptchaToken }: LoginMutationVars) =>
      login(data, recaptchaToken),
    onSuccess: (data) => {
      // Set user data directly in cache (server already returned it)
      queryClient.setQueryData(['me'], { user: data.user });
      // Call the user's onSuccess callback
      onSuccess(data);
    },
    onError,
  });
};

type RegisterMutationVars = {
  data: RegisterRequest;
  recaptchaToken: string;
};

export const useRegister = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: RegisterResponse) => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, recaptchaToken }: RegisterMutationVars) =>
      register(data, recaptchaToken),

    onSuccess: (data) => {
      queryClient.setQueryData(['me'], { user: data.user });
      onSuccess(data);
    },

    onError,
  });
};

export const useLogout = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear 'me' query cache after logout
      queryClient.clear();
      // Call the user's onSuccess callback
      onSuccess();
    },
    onError,
  });
};

type ForgotPasswordMutationVars = {
  data: ForgotPasswordRequest;
  recaptchaToken: string;
};

export const useForgotPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ForgotPasswordResponse) => void;
  onError: (error: ApiError) => void;
}) => {
  return useMutation({
    mutationFn: ({ data, recaptchaToken }: ForgotPasswordMutationVars) =>
      forgotPassword(data, recaptchaToken),
    onSuccess,
    onError,
  });
};

export const useResetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ResetPasswordResponse) => void;
  onError: (error: ApiError) => void;
}) => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess,
    onError,
  });
};
