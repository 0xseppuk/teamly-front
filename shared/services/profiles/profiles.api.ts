import { axiosInstanse } from '../axios';

import {
  MeResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from './profiles.types';

export async function getMe() {
  const response = await axiosInstanse.get<MeResponse>('/auth/me', {
    withCredentials: true,
  });

  return response.data;
}

export async function updateProfile(data: UpdateProfileRequest, id: string) {
  const response = await axiosInstanse.patch<UpdateProfileResponse>(
    `/users/${id}`,
    data,
    {
      withCredentials: true,
    },
  );

  return response.data;
}
