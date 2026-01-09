import { User } from '../../types';
import { Game } from '../games/games.types';
import { ResponseStatus } from '../responses/responses.types';

export type Platform =
  | 'pc'
  | 'playstation'
  | 'xbox'
  | 'nintendo_switch'
  | 'mobile';

export interface GameApplication {
  id: string;
  user_id: string;
  game_id: string;
  game: Game;
  title: string;
  description: string;
  max_players: number;
  min_players: number;
  accepted_players: number;
  prime_time_start: string;
  prime_time_end: string;
  is_active: boolean;
  is_full: boolean;
  with_voice_chat: boolean;
  platform: Platform;
  created_at: string;
  updated_at: string;
  user: User;
  // Информация об отклике текущего пользователя (приходит только для авторизованных)
  user_has_responded?: boolean;
  user_response_status?: ResponseStatus;
  user_response_message?: string;
  // Количество новых (pending) откликов на заявку (только для владельца)
  pending_responses_count?: number;
}

export interface CreateApplicationDTO {
  game_id: string;
  title: string;
  description: string;
  max_players: number;
  min_players: number;
  prime_time_start: string;
  prime_time_end: string;
  with_voice_chat: boolean;
  platform: Platform;
}

export interface ApplicationsResponse {
  applications: GameApplication[];
  count: number;
}
