import { User } from '../../types';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender?: User;
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
  participant1?: User;
  participant2?: User;
  messages?: Message[];
}

export interface ConversationResponse extends Conversation {
  unread_count: number;
  other_user: User;
}

export type ConversationsListResponse = ConversationResponse[];

export interface MessagesResponse {
  messages: Message[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  marked_count: number;
}
