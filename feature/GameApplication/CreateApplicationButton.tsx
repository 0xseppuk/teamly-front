'use client';

import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/use-disclosure';
import { useRouter } from 'next/navigation';

import { CreateApplicationModal } from './CreateApplicationModal';

import { useAuth } from '@/shared';

interface CreateApplicationButtonProps {
  gameId?: string;
}

export function CreateApplicationButton({
  gameId,
}: CreateApplicationButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handlePress = () => {
    if (!user) {
      router.push('/login');

      return;
    }
    onOpen();
  };

  if (isLoading) return null;

  return (
    <>
      <Button color="secondary" size="sm" onPress={handlePress}>
        Создать заявку
      </Button>

      {user && (
        <CreateApplicationModal
          defaultGameId={gameId}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </>
  );
}
