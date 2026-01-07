'use client';

import { Chip } from '@heroui/chip';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';

import { ResponsesList } from './ResponsesList';

import { GameApplication } from '@/shared/services/applications/applications.types';
import { useGetApplicationResponses } from '@/shared/services/responses/responses.hooks';
import { formatTimeRange, getPlatformLabel } from '@/shared/utils';

interface ApplicationResponsesModalProps {
  application: GameApplication;
  isOpen: boolean;
  onOpenChange: () => void;
}

export function ApplicationResponsesModal({
  application,
  isOpen,
  onOpenChange,
}: ApplicationResponsesModalProps) {
  const { data: responses = [], isLoading } = useGetApplicationResponses(
    application.id,
  );

  const timeRange = formatTimeRange(
    application.prime_time_start,
    application.prime_time_end,
  );

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-3 pb-4">
          <h2 className="text-xl font-bold">Отклики на заявку</h2>
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-default-700">
              {application.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <Chip size="sm" startContent="🎮" variant="flat">
                {application.game.name}
              </Chip>
              <Chip size="sm" startContent="👥" variant="flat">
                {application.accepted_players || 0}/{application.max_players}
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
          </div>
        </ModalHeader>

        <ModalBody className="pb-6">
          <ResponsesList isLoading={isLoading} responses={responses} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
