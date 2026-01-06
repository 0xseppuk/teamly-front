import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../axios';
import { login, register } from './auth.api';
import { LoginResponse, RegisterResponse } from './auth.types';

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: LoginResponse) => void;
  onError: (error: ApiError) => void;
}) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
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
  return useMutation({
    mutationFn: register,
    onSuccess,
    onError,
  });
};
