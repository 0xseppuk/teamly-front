import { User } from '@/shared/types';

export interface MeResponse {
  user: User;
}

export interface UpdateProfileRequest {
  discord?: string;
  telegram?: string;
  country_code?: string;
  description?: string;
  birth_date?: string;
  gender?: string;
  languages?: string[];
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}
