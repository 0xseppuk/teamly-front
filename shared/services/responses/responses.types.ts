import type { GameApplication } from '@/shared/services/applications/applications.types';
import type { User } from '@/shared/types';

// Статус отклика
export type ResponseStatus = 'pending' | 'accepted' | 'rejected';

// Основная модель отклика
export interface ApplicationResponse {
  id: string;
  application_id: string;
  application?: GameApplication;
  user_id: string;
  user?: User;
  status: ResponseStatus;
  created_at: string;
  updated_at: string;
  conversation?: Conversation;
}

// Модели для чата (для будущего)
export interface Conversation {
  id: string;
  response_id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: User;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

// DTO для создания отклика
export interface CreateResponseDTO {
  message: string;
}

// DTO для обновления статуса
export interface UpdateResponseStatusDTO {
  status: 'accepted' | 'rejected';
}

// Расширенный тип для UI (отклик с первым сообщением)
export interface ApplicationResponseWithMessage extends ApplicationResponse {
  first_message?: Message;
}
