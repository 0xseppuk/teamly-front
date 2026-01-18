import { Message } from '@/shared/services/conversations';
import { useCallback, useEffect, useRef, useState } from 'react';

type Params = {
  conversationId: string | null;
  currentUserId?: string;
  isConnected: boolean;
  markAsReadSocket: () => void;
  onMessageReceived?: (message: Message) => void;
};

export function useConversationMessages({
  conversationId,
  currentUserId,
  isConnected,
  markAsReadSocket,
  onMessageReceived,
}: Params) {
  const [messages, setMessages] = useState<Message[]>([]);
  const markedRef = useRef<string | null>(null);

  /* === reset on conversation change === */
  useEffect(() => {
    if (!conversationId) return;
    markedRef.current = null;
    setMessages([]);
  }, [conversationId]);

  /* === new message from socket === */
  const onNewMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;

        return [...prev, message];
      });

      if (message.sender_id?.toString() !== currentUserId) {
        markedRef.current = null;
      }

      // Notify parent about new message (for updating conversation list)
      onMessageReceived?.(message);
    },
    [currentUserId, onMessageReceived],
  );

  /* === read logic === */
  useEffect(() => {
    if (!conversationId || !isConnected || !currentUserId) return;
    if (markedRef.current === conversationId) return;

    const hasUnread = messages.some(
      (m) => !m.is_read && m.sender_id?.toString() !== currentUserId,
    );

    if (hasUnread) {
      markAsReadSocket();
      markedRef.current = conversationId;
    }
  }, [messages, conversationId, isConnected, currentUserId, markAsReadSocket]);

  /* === socket events === */
  const onMessageRead = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m)),
    );
  }, []);

  const onMessagesRead = useCallback((ids: string[]) => {
    setMessages((prev) =>
      prev.map((m) => (ids.includes(m.id) ? { ...m, is_read: true } : m)),
    );
  }, []);

  return {
    messages,
    setMessages, // для initial load из API
    onNewMessage,
    onMessageRead,
    onMessagesRead,
  };
}
