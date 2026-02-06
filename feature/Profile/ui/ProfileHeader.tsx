import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';

import { EditIcon } from '@/components/icons';
import { getAvatarColor } from '@/shared/utils/getAvatarColor';

interface ProfileHeaderProps {
  avatar: string | undefined;
  nickname: string;
  userId?: string;
  onClick: () => void;
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  avatar,
  nickname,
  userId,
  onClick,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const avatarFallback = nickname?.charAt(0).toUpperCase() || '?';
  const avatarColorClass = getAvatarColor(userId || nickname);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            isBordered
            classNames={{
              base: `${!avatar ? avatarColorClass : ''} ring-secondary/50`,
              name: 'text-white font-semibold text-xl',
            }}
            name={avatarFallback}
            radius="full"
            size="lg"
            src={avatar}
          />
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-success" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{nickname}</h1>
          <p className="text-sm text-default-400">
            {isOwnProfile ? 'Это ваш профиль' : 'Профиль игрока'}
          </p>
        </div>
      </div>

      {isOwnProfile && (
        <Button
          className="bg-white/10 hover:bg-white/20 border-white/10"
          radius="full"
          size="sm"
          startContent={<EditIcon size={16} />}
          variant="flat"
          onClick={onClick}
        >
          Редактировать
        </Button>
      )}
    </div>
  );
}
