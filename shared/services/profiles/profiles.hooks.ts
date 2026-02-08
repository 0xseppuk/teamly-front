import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from '../axios';

import { getMe, updateProfile } from './profiles.api';
import { UpdateProfileRequest, UpdateProfileResponse } from './profiles.types';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    throwOnError: false,
  });
};

/**
 * Hook для проверки состояния авторизации
 * Использует HTTP-only cookie, поэтому проверяет через API запрос
 */
export const useAuth = () => {
  const { data, isLoading, isError } = useGetMe();

  return {
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
    isLoading,
    isError,
  };
};

export const useUpdateProfile = ({
  onSuccess,
  onError,
  id,
}: {
  onSuccess: (data: UpdateProfileResponse) => void;
  onError: (error: ApiError) => void;
  id: string;
}) => {
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data, id),
    onSuccess,
    onError,
  });
};
