'use client';

import { GameApplication } from '@/shared/services/applications/applications.types';
import {
  formatTimeRange,
  getPlatformLabel,
  getResponseBadgeColor,
  getResponseBadgeText,
} from '@/shared/utils';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { useDisclosure } from '@heroui/modal';
import { Spacer } from '@heroui/spacer';
import Image from 'next/image';

import { CreateResponseModal } from '@/feature/CreateResponse';

interface ApplicationCardProps {
  application: GameApplication;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const hasResponded = application.user_has_responded || false;
  const responseStatus = application.user_response_status;

  const timeRange = formatTimeRange(
    application.prime_time_start,
    application.prime_time_end,
  );

  return (
    <>
      <Card
        className="transition-shadow hover:shadow-lg"
        isPressable
        onPress={onOpen}
        isDisabled={hasResponded}
      >
        <CardHeader className="flex gap-2 p-3 md:gap-3 md:p-4">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg md:h-12 md:w-12">
            <Image
              src={application.game.icon_url || '/placeholder-game.png'}
              alt={application.game.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <p className="text-xs text-default-500 md:text-sm">
              {application.game.name}
            </p>
            <h4 className="text-sm font-semibold md:text-base">
              {application.title}
            </h4>
          </div>
          <div className="flex flex-col gap-1">
            {application.is_active && !hasResponded && (
              <Chip
                size="sm"
                color="success"
                variant="flat"
                className="hidden sm:flex"
              >
                Активна
              </Chip>
            )}
            {hasResponded && (
              <Chip
                size="sm"
                color={getResponseBadgeColor(responseStatus)}
                variant="flat"
                className="hidden sm:flex"
              >
                {getResponseBadgeText(responseStatus)}
              </Chip>
            )}
          </div>
        </CardHeader>
        <CardBody className="p-3 md:p-4">
          <p className="text-xs text-default-600 line-clamp-2 md:text-sm">
            {application.description}
          </p>
          <Spacer y={2} className="md:y-3" />
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            <Chip
              size="sm"
              variant="flat"
              startContent="👥"
              classNames={{ content: 'text-xs md:text-sm' }}
            >
              {application.accepted_players || 0}/{application.max_players}
            </Chip>
            <Chip
              size="sm"
              variant="flat"
              startContent="🎮"
              classNames={{ content: 'text-xs md:text-sm' }}
            >
              {getPlatformLabel(application.platform)}
            </Chip>
            <Chip
              size="sm"
              variant="flat"
              startContent="🕐"
              classNames={{ content: 'text-xs md:text-sm' }}
            >
              {timeRange}
            </Chip>
            {application.with_voice_chat && (
              <Chip
                size="sm"
                variant="flat"
                startContent="🎤"
                classNames={{ content: 'text-xs md:text-sm' }}
              >
                Голосовой чат
              </Chip>
            )}
          </div>
        </CardBody>
        <CardFooter className="p-3 md:p-4">
          <div className="flex w-full items-center gap-2">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-default-100 md:h-8 md:w-8">
                <span className="text-xs font-medium md:text-sm">
                  {application.user?.nickname?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-xs text-default-600 md:text-sm">
                {application.user?.nickname || 'Пользователь'}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Модалка отклика */}
      <CreateResponseModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        application={application}
      />
    </>
  );
}
