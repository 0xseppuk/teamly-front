import { axiosInstanse } from '../axios';

import {
  Conversation,
  ConversationsListResponse,
  MarkAsReadResponse,
  MessagesResponse,
  UnreadCountResponse,
} from './conversations.types';

/**
 * Get all conversations for the authenticated user
 */
export async function getUserConversations() {
  const response =
    await axiosInstanse.get<ConversationsListResponse>('/conversations');

  return response.data;
}

/**
 * Get a specific conversation by ID
 */
export async function getConversationById(id: string) {
  const response = await axiosInstanse.get<Conversation>(
    `/conversations/${id}`,
  );

  return response.data;
}

/**
 * Get messages for a specific conversation with pagination
 */
export async function getConversationMessages(
  id: string,
  params?: {
    limit?: number;
    offset?: number;
  },
) {
  const response = await axiosInstanse.get<MessagesResponse>(
    `/conversations/${id}/messages`,
    { params },
  );

  return response.data;
}

/**
 * Mark all messages in a conversation as read
 */
export async function markConversationAsRead(id: string) {
  const response = await axiosInstanse.patch<MarkAsReadResponse>(
    `/conversations/${id}/read`,
  );

  return response.data;
}

/**
 * Get total unread messages count
 */
export async function getUnreadCount() {
  const response = await axiosInstanse.get<UnreadCountResponse>(
    '/conversations/unread-count',
  );

  return response.data;
}
