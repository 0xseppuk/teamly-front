import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '../axios';

import { login, logout, register } from './auth.api';
import { LoginResponse, RegisterResponse } from './auth.types';

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: LoginResponse) => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Set user data directly in cache (server already returned it)
      queryClient.setQueryData(['me'], { user: data.user });
      // Call the user's onSuccess callback
      onSuccess(data);
    },
    onError,
  });
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
    mutationFn: register,
    onSuccess: (data, variables, context) => {
      // Set user data directly in cache (server already returned it)
      queryClient.setQueryData(['me'], { user: data.user });
      // Call the user's onSuccess callback
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
