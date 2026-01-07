'use client';

import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { Select, SelectItem } from '@heroui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { Game } from '@/shared/services/games/games.types';
import { platformOptions, voiceChatOptions } from '@/shared/utils';

type FilterConfig = {
  label: string;
  placeholder: string;
  selectedKeys: string[];
  onChange: (value: string) => void;
  options: ReadonlyArray<{ key: string; label: string }> | Game[];
  isGame?: boolean;
};

interface ApplicationFiltersClientProps {
  games: Game[];
  initialFilters: {
    game_id?: string;
    platform?: string;
    with_voice_chat?: string;
  };
}

/**
 * Client-side filters component with URL state management
 * Accepts server-rendered initial state
 */
export function ApplicationFiltersClient({
  games,
  initialFilters,
}: ApplicationFiltersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get current values from URL or use initial
  const selectedGame =
    searchParams.get('game_id') || initialFilters.game_id || '';
  const selectedPlatform =
    searchParams.get('platform') || initialFilters.platform || '';
  const withVoiceChat =
    searchParams.get('with_voice_chat') || initialFilters.with_voice_chat || '';

  const updateFilters = (updates: {
    gameId?: string;
    platform?: string;
    voiceChat?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const finalGameId =
      updates.gameId !== undefined ? updates.gameId : selectedGame;
    const finalPlatform =
      updates.platform !== undefined ? updates.platform : selectedPlatform;
    const finalVoiceChat =
      updates.voiceChat !== undefined ? updates.voiceChat : withVoiceChat;

    // Remove all filter params first
    params.delete('game_id');
    params.delete('platform');
    params.delete('with_voice_chat');

    // Add only non-empty params
    if (finalGameId) params.set('game_id', finalGameId);
    if (finalPlatform) params.set('platform', finalPlatform);
    if (finalVoiceChat) params.set('with_voice_chat', finalVoiceChat);

    const queryString = params.toString();

    startTransition(() => {
      router.push(`/applications${queryString ? `?${queryString}` : ''}`, {
        scroll: false, // Don't scroll to top on filter change
      });
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push('/applications', { scroll: false });
    });
    onClose();
  };

  const filterConfigs: FilterConfig[] = [
    {
      label: 'Фильтр по игре',
      placeholder: 'Выберите игру',
      selectedKeys: selectedGame ? [selectedGame] : [],
      onChange: (gameId) => updateFilters({ gameId }),
      options: games,
      isGame: true,
    },
    {
      label: 'Платформа',
      placeholder: 'Выберите платформу',
      selectedKeys: selectedPlatform ? [selectedPlatform] : [],
      onChange: (platform) => updateFilters({ platform }),
      options: platformOptions,
    },
    {
      label: 'Голосовой чат',
      placeholder: 'Любой',
      selectedKeys: withVoiceChat ? [withVoiceChat] : [],
      onChange: (voiceChat) => updateFilters({ voiceChat }),
      options: voiceChatOptions,
    },
  ];

  const hasActiveFilters = selectedGame || selectedPlatform || withVoiceChat;

  const FiltersContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {filterConfigs.map((config, index) => (
        <Select
          key={index}
          className={isMobile ? 'w-full' : 'max-w-xs'}
          isDisabled={isPending}
          label={config.label}
          placeholder={config.placeholder}
          selectedKeys={config.selectedKeys}
          onChange={(e) => config.onChange(e.target.value)}
        >
          {config.options.map((option) => {
            const key = config.isGame
              ? (option as Game).id
              : (option as { key: string }).key;
            const label = config.isGame
              ? (option as Game).name
              : (option as { label: string }).label;

            return <SelectItem key={key}>{label}</SelectItem>;
          })}
        </Select>
      ))}

      {hasActiveFilters && (
        <Button
          className={isMobile ? 'w-full' : 'h-[56px]'}
          isDisabled={isPending}
          variant="flat"
          onPress={handleClearFilters}
        >
          Сбросить фильтры
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop filters */}
      <div className="mb-6 hidden flex-wrap gap-4 md:flex">
        <FiltersContent />
      </div>

      {/* Mobile filter button */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <Button size="sm" variant="flat" onPress={onOpen}>
          Фильтры
        </Button>
      </div>

      {/* Mobile filter modal */}
      <Modal
        classNames={{
          base: 'md:hidden',
          body: 'gap-4',
        }}
        isOpen={isOpen}
        placement="bottom"
        scrollBehavior="inside"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader>Фильтры</ModalHeader>
          <ModalBody className="pb-6">
            <FiltersContent isMobile={true} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
