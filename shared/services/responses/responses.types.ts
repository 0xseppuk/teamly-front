import type { Conversation, Message } from '@/shared';
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
