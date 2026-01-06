export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string | null;
  discord?: string | null;
  telegram?: string | null;
  likes_count: number;
  dislikes_count: number;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}
