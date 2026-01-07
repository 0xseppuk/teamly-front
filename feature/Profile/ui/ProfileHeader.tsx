import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';

import { EditIcon } from '@/components/icons';

//likes dislikes avatar nickname

interface ProfileHeaderProps {
  likes: number;
  dislikes: number;
  avatar: string | undefined;
  nickname: string;
  onClick: () => void;
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  likes,
  dislikes,
  avatar,
  nickname,
  onClick,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const avatarFallback = nickname?.charAt(0).toUpperCase() || '?';

  return (
    <CardHeader>
      <CardHeader className="flex gap-5 justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            isBordered
            classNames={{
              name: 'text-white font-semibold text-lg',
            }}
            name={avatarFallback}
            radius="full"
            size="lg"
            src={avatar}
          />
          <h1 className="text-xl">{nickname}</h1>
          <div className="flex gap-2">
            <Chip color="success" size="sm">
              + {likes}
            </Chip>
            <Chip color="danger" size="sm">
              - {dislikes}
            </Chip>
          </div>
        </div>

        {isOwnProfile && (
          <Button
            isIconOnly
            className="hover:scale-110 transition-transform"
            radius="full"
            size="sm"
            onClick={onClick}
          >
            <EditIcon size={18} />
          </Button>
        )}
      </CardHeader>
    </CardHeader>
  );
}
