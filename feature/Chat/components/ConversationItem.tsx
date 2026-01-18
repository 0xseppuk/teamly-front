import { formatDate } from '@/feature/Chat/utils/formatDateForChat';
import { ConversationResponse } from '@/shared/services/conversations';
import { getAvatarColor } from '@/shared/utils';
import { Avatar } from '@heroui/avatar';
import { useCallback } from 'react';

interface ConversationItemProps {
  conversation: ConversationResponse;
  isSelected: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  isCollapsed,
  onClick,
}: ConversationItemProps) {
  const { other_user, unread_count, last_message_at } = conversation;
  const avatarColor = getAvatarColor(other_user.id);

  const formatDateCallback = useCallback((dateString: string) => {
    return formatDate(dateString);
  }, []);

  return (
    <button
      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-secondary/15 shadow-sm shadow-secondary/10'
          : 'hover:bg-white/50 dark:hover:bg-default-100/50'
      } ${isCollapsed ? 'justify-center' : ''}`}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <Avatar
          classNames={{
            base: `${other_user.avatar_url ? '' : avatarColor} ${
              isSelected ? 'ring-2 ring-secondary/30' : ''
            }`,
            name: 'text-white font-semibold',
          }}
          name={other_user.nickname?.[0]?.toUpperCase()}
          size="md"
          src={other_user.avatar_url || undefined}
        />
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-default-50 rounded-full" />

        {/* Unread badge */}
        {unread_count > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center text-[10px] font-bold bg-secondary text-white rounded-full px-1.5 shadow-lg shadow-secondary/30">
            {unread_count > 99 ? '99+' : unread_count}
          </span>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`font-medium text-sm truncate ${
                isSelected ? 'text-secondary' : 'text-foreground'
              }`}
            >
              {other_user.nickname}
            </p>
            {last_message_at && (
              <span className="text-[11px] text-default-400 flex-shrink-0">
                {formatDateCallback(last_message_at)}
              </span>
            )}
          </div>
          <p className="text-xs text-default-500 truncate mt-0.5">
            {last_message_at ? 'Нажмите чтобы открыть' : 'Нет сообщений'}
          </p>
        </div>
      )}
    </button>
  );
}
