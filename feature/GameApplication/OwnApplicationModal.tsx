'use client';

import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Spacer } from '@heroui/spacer';
import { addToast } from '@heroui/toast';
import { useDisclosure } from '@heroui/use-disclosure';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CreateApplicationModal } from './CreateApplicationModal';

import {
  GameApplication,
  formatTimeRange,
  getPlatformLabel,
  useDeleteApplication,
} from '@/shared';

interface OwnApplicationModalProps {
  application: GameApplication;
  isOpen: boolean;
  onOpenChange: () => void;
}

export function OwnApplicationModal({
  application,
  isOpen,
  onOpenChange,
}: OwnApplicationModalProps) {
  const router = useRouter();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const deleteMutation = useDeleteApplication();
  const [isDeleting, setIsDeleting] = useState(false);

  const timeRange = formatTimeRange(
    application.prime_time_start,
    application.prime_time_end,
  );

  const handleEdit = () => {
    onOpenChange(); // Close main modal
    onEditOpen(); // Open edit modal
  };

  const handleDeleteClick = () => {
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteMutation.mutateAsync(application.id);
      addToast({
        title: 'Заявка удалена',
        description: 'Заявка успешно удалена',
        color: 'success',
      });
      onDeleteOpenChange();
      onOpenChange(); // Close main modal
      router.refresh(); // Refresh server components
    } catch (error) {
      addToast({
        title: 'Ошибка',
        description: `Не удалось удалить заявку`,
        color: 'danger',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditModalClose = (open: boolean) => {
    onEditOpenChange();
    if (!open) {
      // Reopen main modal after edit modal closes
      setTimeout(() => onOpenChange(), 100);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Ваша заявка</h2>
          </ModalHeader>

          <ModalBody className="pb-6">
            <Card>
              <CardHeader className="flex gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    fill
                    alt={application.game.name}
                    className="object-cover"
                    src={application.game.icon_url || '/placeholder-game.png'}
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm text-default-500">
                    {application.game.name}
                  </p>
                  <h4 className="font-semibold">{application.title}</h4>
                </div>
                <div className="flex gap-2">
                  {application.is_active && (
                    <Chip color="success" size="sm" variant="flat">
                      Активна
                    </Chip>
                  )}
                  {application.is_full && (
                    <Chip color="warning" size="sm" variant="flat">
                      Набор закрыт
                    </Chip>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">
                  {application.description}
                </p>
                <Spacer y={3} />
                <div className="flex flex-wrap gap-2">
                  <Chip size="sm" variant="flat">
                    {application.accepted_players || 0}/
                    {application.max_players} игроков
                  </Chip>
                  <Chip size="sm" variant="flat">
                    {getPlatformLabel(application.platform)}
                  </Chip>
                  <Chip size="sm" variant="flat">
                    {timeRange}
                  </Chip>
                  {application.with_voice_chat && (
                    <Chip size="sm" variant="flat">
                      Голосовой чат
                    </Chip>
                  )}
                </div>
              </CardBody>
            </Card>
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onOpenChange}>
              Закрыть
            </Button>
            <Button color="secondary" onPress={handleEdit}>
              Редактировать
            </Button>
            <Button color="danger" variant="flat" onPress={handleDeleteClick}>
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <CreateApplicationModal
        editApplication={application}
        isOpen={isEditOpen}
        onOpenChange={handleEditModalClose}
        onSuccess={() => router.refresh()}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} size="sm" onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          <ModalHeader>Удалить заявку?</ModalHeader>
          <ModalBody>
            <p className="text-default-600">
              Вы уверены, что хотите удалить эту заявку? Это действие нельзя
              отменить.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteOpenChange}>
              Отмена
            </Button>
            <Button
              color="danger"
              isLoading={isDeleting}
              onPress={handleConfirmDelete}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
