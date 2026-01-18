import { Message } from '@/shared/services/conversations';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { CHAT_SOCKET_URL } from '../constants';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface ConversationUpdate {
  conversationId: string;
  lastMessage: Message;
}

interface UseChatSocketOptions {
  conversationId: string | null;
  onNewMessage?: (message: Message) => void;
  onTyping?: (userId: string, isTyping: boolean) => void;
  onMessageRead?: (messageId: string) => void;
  onMessagesRead?: (messageIds: string[]) => void;
  onConversationUpdated?: (update: ConversationUpdate) => void;
  onError?: (error: Error) => void;
}

interface UseChatSocketReturn {
  isConnected: boolean;
  status: ConnectionStatus;
  sendMessage: (content: string) => void;
  sendTyping: (isTyping: boolean) => void;
  markAsRead: (messageId?: string) => void;
}

export function useChatSocket({
  conversationId,
  onNewMessage,
  onTyping,
  onMessageRead,
  onMessagesRead,
  onConversationUpdated,
  onError,
}: UseChatSocketOptions): UseChatSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const currentConversationRef = useRef<string | null>(null);

  // Store callbacks in refs to avoid re-subscribing on every render
  const callbacksRef = useRef({
    onNewMessage,
    onTyping,
    onMessageRead,
    onMessagesRead,
    onConversationUpdated,
    onError,
  });

  callbacksRef.current = {
    onNewMessage,
    onTyping,
    onMessageRead,
    onMessagesRead,
    onConversationUpdated,
    onError,
  };

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      setStatus('error');

      return;
    }

    setStatus('connecting');

    const socket = io(`${CHAT_SOCKET_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      setStatus('connected');
    });

    socket.on('disconnect', (reason) => {
      setStatus('disconnected');
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      setStatus('error');
      callbacksRef.current.onError?.(error);
    });

    socket.on('error', (error) => {
      callbacksRef.current.onError?.(
        new Error(error?.message || 'Socket error'),
      );
    });

    // Global event - fires for any conversation update (via userId room)
    socket.on('conversation_updated', (update: ConversationUpdate) => {
      callbacksRef.current.onConversationUpdated?.(update);
    });

    socketRef.current = socket;

    return () => {
      socket.off('conversation_updated');
      socket.close();
      socketRef.current = null;
      setStatus('disconnected');
    };
  }, []);

  // Handle conversation joining/leaving and event listeners
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || status !== 'connected') return;

    // Leave previous conversation
    if (
      currentConversationRef.current &&
      currentConversationRef.current !== conversationId
    ) {
      socket.emit('leave_conversation', {
        conversationId: currentConversationRef.current,
      });
    }

    // Join new conversation
    if (conversationId) {
      socket.emit('join_conversation', { conversationId });
      currentConversationRef.current = conversationId;
    } else {
      currentConversationRef.current = null;
    }

    const handleNewMessage = (message: Message) => {
      callbacksRef.current.onNewMessage?.(message);
    };

    const handleTyping = ({
      userId,
      isTyping,
    }: {
      userId: string;
      isTyping: boolean;
    }) => {
      callbacksRef.current.onTyping?.(userId, isTyping);
    };

    const handleMessageRead = ({ messageId }: { messageId: string }) => {
      callbacksRef.current.onMessageRead?.(messageId);
    };

    const handleMessagesRead = ({ messageIds }: { messageIds: string[] }) => {
      callbacksRef.current.onMessagesRead?.(messageIds);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);
    socket.on('message_read', handleMessageRead);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
      socket.off('message_read', handleMessageRead);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [conversationId, status]);

  const sendMessage = useCallback((content: string) => {
    const socket = socketRef.current;

    if (!socket || !currentConversationRef.current || !content.trim()) return;

    socket.emit('send_message', {
      conversationId: currentConversationRef.current,
      content: content.trim(),
    });
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    const socket = socketRef.current;

    if (!socket || !currentConversationRef.current) return;

    socket.emit('typing', {
      conversationId: currentConversationRef.current,
      isTyping,
    });
  }, []);

  const markAsRead = useCallback((messageId?: string) => {
    const socket = socketRef.current;

    if (!socket || !currentConversationRef.current) return;

    socket.emit('mark_read', {
      conversationId: currentConversationRef.current,
      messageId,
    });
  }, []);

  return {
    isConnected: status === 'connected',
    status,
    sendMessage,
    sendTyping,
    markAsRead,
  };
}
