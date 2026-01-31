import { formatDate, formatTime } from '@/feature/Chat/utils/formatDateForChat';
import { Message } from '@/shared/services/conversations';
import { User } from '@/shared/types';
import { forwardRef, useCallback, useMemo } from 'react';
import { MessageBubble } from './MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string | undefined;
  currentUser?: User;
  otherUser?: User;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  function ChatMessages(
    { messages, currentUserId, currentUser, otherUser },
    ref,
  ) {
    const formatDateCallback = useCallback((dateString: string) => {
      return formatDate(dateString);
    }, []);

    const groupedMessages = useMemo(() => {
      return messages.reduce(
        (groups, message) => {
          const date = formatDateCallback(message.created_at) || 'Сообщения';

          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(message);

          return groups;
        },
        {} as Record<string, Message[]>,
      );
    }, [messages, formatDateCallback]);

    return (
      <div className="flex-1 overflow-y-auto relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-default-50/50 to-transparent dark:from-default-100/20 pointer-events-none" />

        {/* Messages container */}
        <div className="relative p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-6">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-default-200" />
                    <span className="px-4 py-1.5 text-xs font-medium text-default-500 bg-white/60 dark:bg-default-100/60 backdrop-blur-sm rounded-full border border-white/30 dark:border-default-200/30 shadow-sm">
                      {date}
                    </span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-default-200" />
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  {dateMessages.map((message) => {
                    const isOwn =
                      message.sender_id?.toString() === currentUserId;

                    return (
                      <MessageBubble
                        key={message.id}
                        currentUser={currentUser}
                        formatTime={formatTime}
                        isOwn={isOwn}
                        message={message}
                        otherUser={otherUser}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={ref} />
          </div>
        </div>
      </div>
    );
  },
);
