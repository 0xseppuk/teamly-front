import { GameApplication } from '@/shared/services';
import { ApplicationStatus, User } from '@/shared/types';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface ApplicationResponse {
  id: string;
  application_id: string;
  application?: GameApplication;
  user_id: string;
  user?: User;
  message?: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  conversation?: Conversation;
}

export interface CreateResponseDTO {
  message: string;
}

export interface UpdateResponseStatusDTO {
  status: Omit<ApplicationStatus, 'pending'>;
}

export interface ApplicationResponseWithMessage extends ApplicationResponse {
  first_message: string;
}
