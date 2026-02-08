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
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('id');
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
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ==================== MOBILE DETECTION ==================== */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

      // Auto-select conversation from URL param (?id=...)
      if (conversationIdFromUrl && !selectedConversation) {
        const target = conversationsData.find(
          (c) => c.id === conversationIdFromUrl,
        );

        if (target) {
          setSelectedConversation(target);
        }
      }
    }
  }, [conversationsData, conversationIdFromUrl, selectedConversation]);

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
  // На мобильных: показываем либо sidebar, либо chat
  const showSidebar = isMobileView ? !selectedConversation : true;
  const showChat = isMobileView ? !!selectedConversation : true;

  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full md:gap-4">
        {/* Sidebar - на мобильных занимает весь экран */}
        {showSidebar && (
          <div className={isMobileView ? 'w-full h-full' : ''}>
            <ChatSidebar
              conversations={conversations}
              isCollapsed={isSidebarCollapsed}
              isLoading={isLoadingConversations}
              isMobileView={isMobileView}
              selectedConversationId={selectedConversation?.id || null}
              onSelectConversation={handleSelectConversation}
              onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            />
          </div>
        )}

        {/* Chat - на мобильных занимает весь экран */}
        {showChat && (
          <div
            className={`flex-1 flex flex-col min-w-0 bg-white/60 dark:bg-default-50/60 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/5 ${
              isMobileView
                ? 'w-full h-full rounded-none border-0'
                : 'rounded-3xl border border-white/20 dark:border-default-100/20'
            }`}
          >
            {selectedConversation ? (
              <>
                <ChatHeader
                  isMobileView={isMobileView}
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
        )}
      </div>
    </div>
  );
}
