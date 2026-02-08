import { User } from '@/shared/types';
import { getAvatarColor } from '@/shared/utils';
import { Avatar } from '@heroui/avatar';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface ChatHeaderProps {
  user: User;
  isTyping: boolean;
  isMobileView?: boolean;
  onClose: () => void;
}

export function ChatHeader({
  user,
  isTyping,
  isMobileView = false,
  onClose,
}: ChatHeaderProps) {
  const avatarColor = getAvatarColor(user.id);

  const handleProfileClick = () => {
    window.open(`/users/${user.id}`, '_blank');
  };

  return (
    <div className="relative">
      {/* Glass header */}
      <div className="flex items-center gap-4 h-[72px] px-4 sm:px-6 bg-white/60 dark:bg-default-50/60 backdrop-blur-xl border-b border-white/20 dark:border-default-100/20">
        {/* Back button - показываем только на мобильных */}
        {isMobileView && (
          <button
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-default-100/50 hover:bg-default-200/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            onClick={onClose}
          >
            <ArrowLeft className="text-default-600" size={20} />
          </button>
        )}

        {/* User info - clickable */}
        <button
          className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer"
          onClick={handleProfileClick}
        >
          {/* Avatar with online indicator */}
          <div className="relative">
            <Avatar
              classNames={{
                base: `${user.avatar_url ? '' : avatarColor} ring-2 ring-white/50 dark:ring-default-100/50`,
                name: 'text-white font-semibold',
              }}
              name={user.nickname?.[0]?.toUpperCase()}
              size="md"
              src={user.avatar_url || undefined}
            />
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-default-50 rounded-full" />
          </div>

          {/* Name and status */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-secondary transition-colors">
                {user.nickname}
              </h3>
              <ExternalLink
                className="text-default-400 opacity-0 group-hover:opacity-100 transition-opacity"
                size={14}
              />
            </div>
            <p className="text-sm text-default-500">
              {isTyping ? (
                <span className="text-secondary flex items-center gap-1">
                  <span className="flex gap-0.5">
                    <span
                      className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                  печатает
                </span>
              ) : (
                'в сети'
              )}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
