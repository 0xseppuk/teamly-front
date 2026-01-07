import { GameApplication } from '../applications/applications.types';
import { axiosInstanse } from '../axios';

import { User } from '@/shared/types';

interface GetUserByIdResponse {
  user: User;
  applications: GameApplication[];
}

export async function getUserById(id: string): Promise<GetUserByIdResponse> {
  const response = await axiosInstanse.get<GetUserByIdResponse>(`/users/${id}`);

  return response.data;
}
