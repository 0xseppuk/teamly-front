'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Skeleton } from '@heroui/skeleton';
import { Spacer } from '@heroui/spacer';
import { useDisclosure } from '@heroui/use-disclosure';
import Image from 'next/image';
import { useState } from 'react';

import { MyResponseModal } from './MyResponseModal';

import {
  ApplicationResponse,
  formatRelativeTime,
  formatTimeRange,
  getPlatformLabel,
  getResponseBadgeColor,
  getResponseBadgeText,
  useGetMyResponses,
} from '@/shared';

export function MyResponsesList() {
  const { data: responses, isLoading } = useGetMyResponses();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedResponse, setSelectedResponse] = useState<
    ApplicationResponse | undefined
  >(undefined);

  const handleViewResponse = (response: ApplicationResponse) => {
    setSelectedResponse(response);
    onOpen();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full rounded-lg" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="rounded-full bg-white/10 p-4">
          <svg
            className="h-10 w-10 text-default-400"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-semibold">Нет откликов</h3>
          <p className="text-sm text-default-500">
            Вы ещё не откликались на заявки других игроков
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Мои отклики ({responses.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {responses.map((response) => {
          if (!response.application || !response.application.is_active)
            return null;

          const app = response.application;
          const timeRange = formatTimeRange(
            app.prime_time_start,
            app.prime_time_end,
          );

          const firstMessage = response.conversation?.messages?.[0];

          const isAccepted = response.status === 'accepted';

          return (
            <Card
              key={response.id}
              isPressable
              className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              onPress={() => handleViewResponse(response)}
            >
              <CardHeader className="flex gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    fill
                    alt={app.game.name}
                    className="object-cover"
                    src={app.game.icon_url || '/placeholder-game.png'}
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm text-default-500">{app.game.name}</p>
                  <h4 className="font-semibold">{app.title}</h4>
                  {isAccepted && (
                    <p className="text-xs text-success mt-1">
                      Вы приняты в команду
                    </p>
                  )}
                </div>
                <Chip
                  color={getResponseBadgeColor(response.status)}
                  size="sm"
                  variant="flat"
                >
                  {getResponseBadgeText(response.status)}
                </Chip>
              </CardHeader>
              <CardBody>
                {firstMessage && (
                  <>
                    <p className="text-sm text-default-600 line-clamp-2">
                      {firstMessage.content}
                    </p>
                    <Spacer y={2} />
                  </>
                )}
                <p className="text-xs text-default-500">
                  Отправлено {formatRelativeTime(response.created_at)}
                  {response.status !== 'pending' &&
                    ` • ${response.status === 'accepted' ? 'Принят' : 'Отклонён'} ${formatRelativeTime(response.updated_at)}`}
                </p>
                <Spacer y={3} />
                <div className="flex flex-wrap gap-2">
                  <Chip size="sm" startContent="👥" variant="flat">
                    {app.accepted_players}/{app.max_players} игроков
                  </Chip>
                  <Chip size="sm" startContent="🎮" variant="flat">
                    {getPlatformLabel(app.platform)}
                  </Chip>
                  <Chip size="sm" startContent="🕐" variant="flat">
                    {timeRange}
                  </Chip>
                  {app.with_voice_chat && (
                    <Chip size="sm" startContent="🎤" variant="flat">
                      Голосовой чат
                    </Chip>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Modal for viewing response details */}
      {selectedResponse && (
        <MyResponseModal
          isOpen={isOpen}
          response={selectedResponse}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  );
}
