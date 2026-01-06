'use client';

import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Textarea } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { GameApplication } from '@/shared/services/applications/applications.types';
import { useCreateApplicationResponse } from '@/shared/services/responses/responses.hooks';
import { formatTimeRange, getPlatformLabel } from '@/shared/utils';

import { createResponseSchema, type CreateResponseFormData } from './schema';
import { ResponseForm } from './ui/ResponseForm';

interface CreateResponseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  application: GameApplication;
}

export function CreateResponseModal({
  isOpen,
  onOpenChange,
  application,
}: CreateResponseModalProps) {
  const { control, handleSubmit, reset } = useForm<CreateResponseFormData>({
    resolver: zodResolver(createResponseSchema),
    defaultValues: { message: '' },
  });

  const createMutation = useCreateApplicationResponse();

  // Используем данные из самой заявки
  const hasResponded = application.user_has_responded || false;
  const responseStatus = application.user_response_status;

  const onSubmit = async (data: CreateResponseFormData) => {
    try {
      await createMutation.mutateAsync({
        applicationId: application.id,
        data,
      });

      addToast({
        title: 'Отклик отправлен',
        description: 'Автор заявки получит уведомление',
        color: 'success',
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      addToast({
        title: 'Ошибка',
        description: 'Не удалось отправить отклик. Попробуйте позже',
        color: 'danger',
      });
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      onClose={handleClose}
      classNames={{ base: 'max-h-[90vh]' }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Откликнуться на заявку</h2>
          <p className="text-sm font-normal text-default-500">
            {application.title}
          </p>
        </ModalHeader>

        <ModalBody>
          {/* Информация о заявке */}
          <div className="rounded-lg bg-default-100 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{application.game.name}</p>
              <Chip size="sm" variant="flat" className="text-xs">
                {getPlatformLabel(application.platform)}
              </Chip>
              <Chip size="sm" variant="flat" className="text-xs">
                {formatTimeRange(
                  application.prime_time_start,
                  application.prime_time_end,
                )}
              </Chip>
            </div>
            <p className="text-xs text-default-600 line-clamp-2">
              {application.description}
            </p>
          </div>

          {/* Уведомление если уже откликнулся */}
          {hasResponded && (
            <>
              <div className="rounded-lg border border-warning bg-warning-50/50 p-4">
                <p className="text-sm font-medium text-warning-700">
                  Вы уже откликнулись на эту заявку
                </p>
                <p className="mt-1 text-xs text-warning-600">
                  Статус: {responseStatus === 'pending' && 'Ожидание ответа'}
                  {responseStatus === 'accepted' && 'Принят'}
                  {responseStatus === 'rejected' && 'Отклонен'}
                </p>
              </div>

              {responseStatus === 'pending' && application.user_response_message && (
                <Textarea
                  label="Ваше сообщение"
                  variant="bordered"
                  value={application.user_response_message}
                  isReadOnly
                  minRows={6}
                  classNames={{
                    input: 'text-sm',
                    label: 'text-sm font-medium',
                  }}
                />
              )}
            </>
          )}

          {/* Форма */}
          {!hasResponded && (
            <ResponseForm
              control={control}
              isDisabled={createMutation.isPending}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            {hasResponded ? 'Закрыть' : 'Отмена'}
          </Button>
          {!hasResponded && (
            <Button
              color="secondary"
              onPress={() => handleSubmit(onSubmit)()}
              isLoading={createMutation.isPending}
            >
              Отправить отклик
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
