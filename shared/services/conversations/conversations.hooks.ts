import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getConversationById,
  getConversationMessages,
  getUnreadCount,
  getUserConversations,
  markConversationAsRead,
} from './conversations.api';

/**
 * Get all conversations for the authenticated user
 */
export const useGetUserConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getUserConversations,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

/**
 * Get a specific conversation by ID
 */
export const useGetConversationById = (id: string) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: () => getConversationById(id),
    enabled: !!id,
  });
};

/**
 * Get messages for a specific conversation with pagination
 */
export const useGetConversationMessages = (
  id: string,
  params?: {
    limit?: number;
    offset?: number;
  },
) => {
  return useQuery({
    queryKey: ['conversation', id, 'messages', params],
    queryFn: () => getConversationMessages(id, params),
    enabled: !!id,
    staleTime: 10000, // 10 seconds
  });
};

/**
 * Get total unread messages count
 */
export const useGetUnreadCount = (enabled?: boolean) => {
  return useQuery({
    queryKey: ['conversations', 'unread-count'],
    queryFn: getUnreadCount,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    enabled,
  });
};

/**
 * Mark all messages in a conversation as read
 */
export const useMarkConversationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markConversationAsRead(id),
    onSuccess: (_, id) => {
      // Invalidate conversations list to update unread counts
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      // Invalidate specific conversation messages
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: ['conversations', 'unread-count'],
      });
    },
  });
};
