'use client';

import {
  ChatHeader,
  ChatInput,
  ChatMessages,
  ChatSidebar,
  EmptyState,
} from '@/feature/Chat/components';
import { useChatSocket, useConversationMessages } from '@/feature/Chat/hooks';
import {
  ConversationResponse,
  Message,
  useGetConversationMessages,
  useGetMe,
  useGetUserConversations,
} from '@/shared';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  /* ==================== UI STATE ==================== */
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse | null>(null);
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    [],
  );
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ==================== API ==================== */
  const { data: meData } = useGetMe();
  const { data: conversationsData, isLoading: isLoadingConversations } =
    useGetUserConversations();

  const { data: messagesData } = useGetConversationMessages(
    selectedConversation?.id || '',
    { limit: 50, offset: 0 },
  );

  const currentUserId = meData?.user?.id?.toString();

  /* ==================== CONVERSATIONS ==================== */
  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
    }
  }, [conversationsData]);

  const clearUnreadCount = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unread_count: 0 } : conv,
      ),
    );

    setSelectedConversation((prev) =>
      prev?.id === conversationId ? { ...prev, unread_count: 0 } : prev,
    );
  }, []);

  const handleSelectConversation = useCallback(
    (conversation: ConversationResponse) => {
      setSelectedConversation(conversation);
      setIsTyping(false);
    },
    [],
  );

  const handleConversationUpdated = useCallback(
    (update: { conversationId: string; lastMessage: Message }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === update.conversationId
            ? {
                ...conv,
                last_message_at: update.lastMessage.created_at,
                unread_count:
                  selectedConversation?.id === update.conversationId
                    ? conv.unread_count
                    : conv.unread_count + 1,
              }
            : conv,
        ),
      );
    },
    [selectedConversation?.id],
  );

  /* ==================== SOCKET ==================== */
  const { sendMessage, sendTyping, markAsRead, isConnected } = useChatSocket({
    conversationId: selectedConversation?.id || null,
    onTyping: (userId, typing) => {
      if (userId !== selectedConversation?.other_user.id) return;
      setIsTyping(typing);
    },
    onConversationUpdated: handleConversationUpdated,
  });

  /* ==================== MESSAGES DOMAIN ==================== */
  const updateConversationTime = useCallback(
    (message: Message) => {
      if (!selectedConversation) return;
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, last_message_at: message.created_at }
            : conv,
        ),
      );
    },
    [selectedConversation],
  );

  const { messages, setMessages, onNewMessage, onMessageRead, onMessagesRead } =
    useConversationMessages({
      conversationId: selectedConversation?.id || null,
      currentUserId,
      isConnected,
      markAsReadSocket: () => {
        markAsRead();
        if (selectedConversation) {
          clearUnreadCount(selectedConversation.id);
        }
      },
      onMessageReceived: updateConversationTime,
    });

  /* === bind socket → messages === */
  useChatSocket({
    conversationId: selectedConversation?.id || null,
    onNewMessage,
    onMessageRead,
    onMessagesRead,
  });

  /* ==================== INITIAL LOAD ==================== */
  useEffect(() => {
    if (!messagesData?.messages) return;

    const sorted = [...messagesData.messages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    setMessages(sorted);
  }, [messagesData, setMessages]);

  /* ==================== UI EFFECTS ==================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ==================== ACTIONS ==================== */
  const handleSendMessage = useCallback(() => {
    if (!selectedConversation || !messageInput.trim() || isSending) return;

    setIsSending(true);
    sendMessage(messageInput.trim());
    setMessageInput('');

    setTimeout(() => setIsSending(false), 300);
  }, [selectedConversation, messageInput, isSending, sendMessage]);

  const handleCloseChat = useCallback(() => {
    setSelectedConversation(null);
    setIsTyping(false);
    setIsSending(false);
  }, []);

  /* ==================== RENDER ==================== */
  return (
    <div className="h-[calc(100vh-100px)]">
      <div className="flex h-full gap-4">
        <ChatSidebar
          conversations={conversations}
          isCollapsed={isSidebarCollapsed}
          isLoading={isLoadingConversations}
          selectedConversationId={selectedConversation?.id || null}
          onSelectConversation={handleSelectConversation}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-white/60 dark:bg-default-50/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-default-100/20 overflow-hidden shadow-xl shadow-black/5">
          {selectedConversation ? (
            <>
              <ChatHeader
                isTyping={isTyping}
                user={selectedConversation.other_user}
                onClose={handleCloseChat}
              />

              <ChatMessages
                ref={messagesEndRef}
                currentUser={meData?.user}
                currentUserId={currentUserId}
                messages={messages}
                otherUser={selectedConversation.other_user}
              />

              <ChatInput
                isSending={isSending}
                value={messageInput}
                onChange={setMessageInput}
                onSend={handleSendMessage}
                onTypingEnd={() => sendTyping(false)}
                onTypingStart={() => sendTyping(true)}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
