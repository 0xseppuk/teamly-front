'use client';

import type { GameApplication } from '@/shared/services/applications/applications.types';

import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Textarea } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { addToast } from '@heroui/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createResponseSchema, type CreateResponseFormData } from './schema';
import { ResponseForm } from './ui/ResponseForm';

import { routes } from '@/shared';
import { useCreateApplicationResponse } from '@/shared/services/responses/responses.hooks';
import { formatTimeRange, getPlatformLabel } from '@/shared/utils';
import { useRouter } from 'next/navigation';

interface CreateResponseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  application: GameApplication;
  isAuth?: boolean;
}

export function CreateResponseModal({
  isOpen,
  onOpenChange,
  application,
  isAuth,
}: CreateResponseModalProps) {
  const { control, handleSubmit, reset } = useForm<CreateResponseFormData>({
    resolver: zodResolver(createResponseSchema),
    defaultValues: { message: '' },
  });

  const router = useRouter();

  const createMutation = useCreateApplicationResponse();

  const hasResponded = application.user_has_responded || false;
  const responseStatus = application.user_response_status;

  const redirectSubmit = () => {
    router.push(routes.login);
  };

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
        description: `Не удалось отправить отклик. Попробуйте позже ${error}`,
        color: 'danger',
      });
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const textAreaPlaceholder = isAuth
    ? 'Привет! Хочу присоединиться к вашей команде. Играю на позиции саппорта, ранк Gold Nova 3...'
    : 'Войдите чтобы откликнуться';

  return (
    <Modal
      classNames={{ base: 'max-h-[90vh]' }}
      isOpen={isOpen}
      size="lg"
      onClose={handleClose}
      onOpenChange={onOpenChange}
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
              <Chip className="text-xs" size="sm" variant="flat">
                {getPlatformLabel(application.platform)}
              </Chip>
              <Chip className="text-xs" size="sm" variant="flat">
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

              {responseStatus === 'pending' &&
                application.user_response_message && (
                  <Textarea
                    isReadOnly
                    classNames={{
                      input: 'text-sm',
                      label: 'text-sm font-medium',
                    }}
                    label="Ваше сообщение"
                    minRows={6}
                    value={application.user_response_message}
                    variant="flat"
                  />
                )}
            </>
          )}

          {/* Форма */}
          {!hasResponded && (
            <ResponseForm
              control={control}
              isDisabled={createMutation.isPending || !isAuth}
              placeholder={textAreaPlaceholder}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            {hasResponded ? 'Закрыть' : 'Отмена'}
          </Button>
          {!hasResponded && isAuth && (
            <Button
              color="secondary"
              isLoading={createMutation.isPending}
              onPress={() => handleSubmit(onSubmit)()}
            >
              Отправить отклик
            </Button>
          )}
          {!isAuth && (
            <Button color="secondary" onPress={redirectSubmit}>
              Войти
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
