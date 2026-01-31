import { Message } from '@/shared/services/conversations';
import { User } from '@/shared/types';
import { getAvatarColor } from '@/shared/utils';
import { Avatar } from '@heroui/avatar';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  otherUser?: User;
  currentUser?: User;
  formatTime: (date: string) => string;
}

export function MessageBubble({
  message,
  isOwn,
  otherUser,
  currentUser,
  formatTime,
}: MessageBubbleProps) {
  const user = isOwn ? currentUser : otherUser;
  const avatarColor = getAvatarColor(user?.id);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`flex items-end gap-2.5 max-w-[75%] ${isOwn ? 'flex-row-reverse' : ''}`}
      >
        {/* Avatar */}
        {user && (
          <Avatar
            className="flex-shrink-0 mb-6"
            classNames={{
              base: `w-8 h-8 ${user.avatar_url ? '' : avatarColor} ring-2 ring-white/50 dark:ring-default-100/50`,
              name: 'text-white text-xs font-semibold',
            }}
            name={user.nickname?.[0]?.toUpperCase()}
            size="sm"
            src={user.avatar_url || undefined}
          />
        )}

        {/* Message bubble */}
        <div className="relative">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isOwn
                ? 'bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-br-sm'
                : 'bg-white/70 dark:bg-default-100/70 backdrop-blur-sm text-foreground rounded-bl-sm border border-white/30 dark:border-default-200/30'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* Time and read status */}
          <div
            className={`flex items-center gap-1.5 mt-1.5 px-1 ${
              isOwn ? 'justify-end' : 'justify-start'
            }`}
          >
            <span
              className={`text-[11px] ${
                isOwn ? 'text-default-400' : 'text-default-400'
              }`}
            >
              {formatTime(message.created_at)}
            </span>
            {isOwn && (
              <span className="flex items-center">
                {message.is_read ? (
                  <CheckCheck className="text-secondary" size={14} />
                ) : (
                  <Check className="text-default-400" size={14} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
