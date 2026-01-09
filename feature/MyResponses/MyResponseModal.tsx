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
import Image from 'next/image';

import {
  ApplicationResponse,
  formatTimeRange,
  getPlatformLabel,
  getResponseBadgeColor,
  getResponseBadgeText,
} from '@/shared';

interface MyResponseModalProps {
  response: ApplicationResponse;
  isOpen: boolean;
  onOpenChange: () => void;
}

export function MyResponseModal({
  response,
  isOpen,
  onOpenChange,
}: MyResponseModalProps) {
  if (!response.application) return null;

  const application = response.application;

  console.log(application);
  const timeRange = formatTimeRange(
    application.prime_time_start,
    application.prime_time_end,
  );
  const isAccepted = response.status === 'accepted';

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Детали заявки</h2>
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
                {isAccepted && (
                  <p className="text-xs text-success mt-1">
                    Вы приняты в команду
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Chip
                  color={getResponseBadgeColor(response.status)}
                  size="sm"
                  variant="flat"
                >
                  {getResponseBadgeText(response.status)}
                </Chip>
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
                <Chip size="sm" startContent="👥" variant="flat">
                  {application.accepted_players || 0}/{application.max_players}{' '}
                  игроков
                </Chip>
                <Chip size="sm" startContent="🎮" variant="flat">
                  {getPlatformLabel(application.platform)}
                </Chip>
                <Chip size="sm" startContent="🕐" variant="flat">
                  {timeRange}
                </Chip>
                {application.with_voice_chat && (
                  <Chip size="sm" startContent="🎤" variant="flat">
                    Голосовой чат
                  </Chip>
                )}
              </div>

              {response.conversation?.messages?.[0] && (
                <>
                  <Spacer y={4} />
                  <div className="p-4 bg-default-100 rounded-lg">
                    <p className="text-xs text-default-500 mb-2">
                      Ваше сообщение:
                    </p>
                    <p className="text-sm text-default-700">
                      {response.conversation.messages[0].content}
                    </p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onOpenChange}>
            Закрыть
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
