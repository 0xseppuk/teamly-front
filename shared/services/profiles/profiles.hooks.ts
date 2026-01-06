import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '../axios';
import { getMe, updateProfile } from './profiles.api';
import { UpdateProfileRequest, UpdateProfileResponse } from './profiles.types';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });
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
