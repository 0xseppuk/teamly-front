'use client';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { addToast } from '@heroui/toast';
import { useRouter } from 'next/navigation';

import {
  ApplicationResponseWithMessage,
  formatRelativeTime,
  getResponseBadgeColor,
  getResponseBadgeText,
  useUpdateResponseStatus,
} from '@/shared';

interface ResponseItemProps {
  response: ApplicationResponseWithMessage;
}

export function ResponseItem({ response }: ResponseItemProps) {
  const router = useRouter();
  const { mutate: updateStatus, isPending } = useUpdateResponseStatus();

  const isPendingStatus = response.status === 'pending';
  const firstMessage = response.conversation?.messages?.[0];

  const handleAccept = () => {
    updateStatus(
      {
        responseId: response.id,
        data: { status: 'accepted' },
      },
      {
        onSuccess: () => {
          addToast({
            title: 'Отклик принят',
            description: 'Пользователь добавлен в команду',
            color: 'success',
          });
        },
        onError: () => {
          addToast({
            title: 'Ошибка',
            description: 'Не удалось принять отклик',
            color: 'danger',
          });
        },
      },
    );
  };

  const handleReject = () => {
    updateStatus(
      {
        responseId: response.id,
        data: { status: 'rejected' },
      },
      {
        onSuccess: () => {
          addToast({
            title: 'Отклик отклонен',
            description: 'Пользователю отправлено уведомление',
            color: 'success',
          });
        },
        onError: () => {
          addToast({
            title: 'Ошибка',
            description: 'Не удалось отклонить отклик',
            color: 'danger',
          });
        },
      },
    );
  };

  const handleOpenChat = () => {
    // TODO: Implement chat navigation when chat feature is ready
    // router.push(`/chat/${response.conversation?.id}`);
    addToast({
      title: 'Чат',
      description: 'Функция чатов в разработке',
      color: 'warning',
    });
  };

  const handleViewProfile = () => {
    if (response.user?.id) {
      router.push(`/users/${response.user.id}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3 items-start">
        <Avatar
          isBordered
          showFallback
          className="cursor-pointer hover:scale-105 transition-transform"
          name={response.user?.nickname}
          size="md"
          src={response.user?.avatar_url}
          onClick={handleViewProfile}
        />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">
              {response.user?.nickname || 'Пользователь'}
            </h4>
            <Chip
              color={getResponseBadgeColor(response.status)}
              size="sm"
              variant="flat"
            >
              {getResponseBadgeText(response.status)}
            </Chip>
          </div>
          <p className="text-xs text-default-500">
            {isPendingStatus
              ? `Отправлено ${formatRelativeTime(response.created_at)}`
              : response.status === 'accepted'
                ? `Принят ${formatRelativeTime(response.updated_at)}`
                : `Отклонён ${formatRelativeTime(response.updated_at)}`}
          </p>
        </div>
      </CardHeader>

      <CardBody className="py-3">
        <p className="text-sm text-default-700">
          {firstMessage?.content || 'Сообщение не найдено'}
        </p>
      </CardBody>

      <CardFooter className="gap-2 flex-wrap">
        <Button
          color="secondary"
          size="sm"
          startContent="💬"
          variant="flat"
          onPress={handleOpenChat}
        >
          {isPendingStatus ? 'Написать' : 'Открыть чат'}
        </Button>

        {isPendingStatus && (
          <>
            <Button
              color="success"
              isLoading={isPending}
              size="sm"
              variant="flat"
              onPress={handleAccept}
            >
              ✓ Принять
            </Button>
            <Button
              color="danger"
              isLoading={isPending}
              size="sm"
              variant="flat"
              onPress={handleReject}
            >
              ✗ Отклонить
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
