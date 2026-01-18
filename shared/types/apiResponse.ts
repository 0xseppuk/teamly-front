export type Country = {
  code: string;
  name: string;
  name_ru: string;
  flag: string;
  region: string;
};

export type User = {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  discord?: string;
  telegram?: string;
  country_code?: string;
  country?: Country;
  description?: string;
  birth_date?: string;
  gender?: string;
  languages?: string[];
  likes_count: number;
  dislikes_count: number;
  created_at: string;
  updated_at: string;
};
