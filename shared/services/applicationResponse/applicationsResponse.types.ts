import { GameApplication } from '@/shared/services';
import { ApplicationStatus, User } from '@/shared/types';

export interface ApplicationResponse {
  id: string;
  application_id: string;
  application: GameApplication;
  user_id: string;
  user?: User;
  message: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  //conversation: Conversation;
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
