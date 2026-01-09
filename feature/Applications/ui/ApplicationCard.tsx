'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { useDisclosure } from '@heroui/modal';
import { Spacer } from '@heroui/spacer';
import Image from 'next/image';

import { CreateResponseModal } from '@/feature/CreateResponse';
import { OwnApplicationModal } from '@/feature/GameApplication/OwnApplicationModal';
import { GameApplication } from '@/shared/services/applications/applications.types';
import { useGetMe } from '@/shared/services/profiles/profiles.hooks';
import {
  formatTimeRange,
  getPlatformLabel,
  getResponseBadgeColor,
  getResponseBadgeText,
} from '@/shared/utils';

interface ApplicationCardProps {
  application: GameApplication;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOwnOpen,
    onOpen: onOwnOpen,
    onOpenChange: onOwnOpenChange,
  } = useDisclosure();
  const { data: meData } = useGetMe();

  const hasResponded = application.user_has_responded || false;
  const responseStatus = application.user_response_status;
  const isOwnApplication = meData?.user?.id?.toString() === application.user_id;

  const timeRange = formatTimeRange(
    application.prime_time_start,
    application.prime_time_end,
  );

  return (
    <>
      <Card
        isPressable
        className="transition-shadow hover:shadow-lg"
        isDisabled={hasResponded}
        onPress={isOwnApplication ? onOwnOpen : onOpen}
      >
        <CardHeader className="flex gap-2 p-3 md:gap-3 md:p-4">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg md:h-12 md:w-12">
            <Image
              fill
              alt={application.game.name}
              className="object-cover"
              src={application.game.icon_url || '/placeholder-game.png'}
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
            {isOwnApplication && (
              <>
                <Chip
                  className="hidden sm:flex"
                  color="primary"
                  size="sm"
                  variant="flat"
                >
                  Ваша заявка
                </Chip>
                {application.pending_responses_count !== undefined &&
                  application.pending_responses_count > 0 && (
                    <Chip
                      className="hidden sm:flex"
                      color="danger"
                      size="sm"
                      variant="solid"
                    >
                      {application.pending_responses_count} новых
                    </Chip>
                  )}
              </>
            )}
            {!isOwnApplication && application.is_active && !hasResponded && (
              <Chip
                className="hidden sm:flex"
                color="success"
                size="sm"
                variant="flat"
              >
                Активна
              </Chip>
            )}
            {hasResponded && (
              <Chip
                className="hidden sm:flex"
                color={getResponseBadgeColor(responseStatus)}
                size="sm"
                variant="flat"
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
          <Spacer className="md:y-3" y={2} />
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            <Chip
              classNames={{ content: 'text-xs md:text-sm' }}
              size="sm"
              startContent="👥"
              variant="flat"
            >
              {application.accepted_players || 0}/{application.max_players}
            </Chip>
            <Chip
              classNames={{ content: 'text-xs md:text-sm' }}
              size="sm"
              startContent="🎮"
              variant="flat"
            >
              {getPlatformLabel(application.platform)}
            </Chip>
            <Chip
              classNames={{ content: 'text-xs md:text-sm' }}
              size="sm"
              startContent="🕐"
              variant="flat"
            >
              {timeRange}
            </Chip>
            {application.with_voice_chat && (
              <Chip
                classNames={{ content: 'text-xs md:text-sm' }}
                size="sm"
                startContent="🎤"
                variant="flat"
              >
                Голосовой чат
              </Chip>
            )}
          </div>
        </CardBody>
        <CardFooter className="p-3 md:p-4">
          <div className="flex w-full items-center justify-between gap-2">
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
            {isOwnApplication && (
              <span className="text-xs text-default-400 italic">
                Вы не можете откликнуться на свою заявку
              </span>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Показываем разные модалки в зависимости от того, своя ли это заявка */}
      {isOwnApplication ? (
        <OwnApplicationModal
          application={application}
          isOpen={isOwnOpen}
          onOpenChange={onOwnOpenChange}
        />
      ) : (
        <CreateResponseModal
          application={application}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}
