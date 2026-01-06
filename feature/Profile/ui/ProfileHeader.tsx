import { EditIcon } from '@/components/icons';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';

//likes dislikes avatar nickname

interface ProfileHeaderProps {
  likes: number;
  dislikes: number;
  avatar: string | undefined;
  nickname: string;
  onClick: () => void;
}

export function ProfileHeader({
  likes,
  dislikes,
  avatar,
  nickname,
  onClick,
}: ProfileHeaderProps) {
  const avatarFallback = nickname?.charAt(0).toUpperCase() || '?';
  return (
    <CardHeader>
      <CardHeader className="flex gap-5 justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            isBordered
            radius="full"
            size="lg"
            src={avatar}
            name={avatarFallback}
            classNames={{
              name: 'text-white font-semibold text-lg',
            }}
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

        <Button
          isIconOnly
          size="sm"
          radius="full"
          className="hover:scale-110 transition-transform"
          onClick={onClick}
        >
          <EditIcon size={18} />
        </Button>
      </CardHeader>
    </CardHeader>
  );
}
