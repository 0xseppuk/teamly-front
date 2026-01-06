import { User } from '../../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  avatarUrl?: string;
  discord?: string;
  telegram?: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}
