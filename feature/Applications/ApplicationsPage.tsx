/**
 * @deprecated This component is deprecated in favor of SSR implementation
 * The new implementation is in app/applications/page.tsx
 *
 * This file is kept for reference and backward compatibility
 * but should not be used in new code.
 *
 * Migration: Use app/applications/page.tsx with Server Components
 */

'use client';

import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import {
  ApplicationCard,
  ApplicationFilters,
  ApplicationsSkeleton,
  EmptyState,
} from './ui';

import { useGetAllApplications } from '@/shared/services/applications';
import { useGetGames } from '@/shared/services/games/games.hooks';

export function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedGame, setSelectedGame] = useState<string>(
    searchParams.get('game_id') || '',
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    searchParams.get('platform') || '',
  );
  const [withVoiceChat, setWithVoiceChat] = useState<string>(
    searchParams.get('with_voice_chat') || '',
  );

  const { data: gamesData } = useGetGames();

  const filterParams = {
    ...(selectedGame && { game_id: selectedGame }),
    ...(selectedPlatform && { platform: selectedPlatform }),
    ...(withVoiceChat && { with_voice_chat: withVoiceChat === 'true' }),
  };

  const { data, isLoading } = useGetAllApplications(
    Object.keys(filterParams).length > 0 ? filterParams : undefined,
  );

  useEffect(() => {
    const gameId = searchParams.get('game_id');
    const platform = searchParams.get('platform');
    const voiceChat = searchParams.get('with_voice_chat');

    if (gameId) setSelectedGame(gameId);
    if (platform) setSelectedPlatform(platform);
    if (voiceChat) setWithVoiceChat(voiceChat);
  }, [searchParams]);

  const games = gamesData?.games || [];
  const applications = data?.applications || [];

  const updateFilters = (updates: {
    gameId?: string;
    platform?: string;
    voiceChat?: string;
  }) => {
    const params = new URLSearchParams();

    const finalGameId =
      updates.gameId !== undefined ? updates.gameId : selectedGame;
    const finalPlatform =
      updates.platform !== undefined ? updates.platform : selectedPlatform;
    const finalVoiceChat =
      updates.voiceChat !== undefined ? updates.voiceChat : withVoiceChat;

    if (finalGameId) params.set('game_id', finalGameId);
    if (finalPlatform) params.set('platform', finalPlatform);
    if (finalVoiceChat) params.set('with_voice_chat', finalVoiceChat);

    const query = params.toString();

    startTransition(() => {
      router.push(`/applications${query ? `?${query}` : ''}`);
    });
  };

  const handleGameChange = (gameId: string) => {
    setSelectedGame(gameId);
    updateFilters({ gameId });
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    updateFilters({ platform });
  };

  const handleVoiceChatChange = (voiceChat: string) => {
    setWithVoiceChat(voiceChat);
    updateFilters({ voiceChat });
  };

  const handleClearFilter = () => {
    setSelectedGame('');
    setSelectedPlatform('');
    setWithVoiceChat('');
    startTransition(() => {
      router.push('/applications');
    });
    onClose();
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-4 flex items-center justify-between md:mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Все заявки</h1>
        <Button className="md:hidden" size="sm" variant="flat" onPress={onOpen}>
          Фильтры
        </Button>
      </div>

      <div className="mb-6 hidden flex-wrap gap-4 md:flex">
        <ApplicationFilters
          games={games}
          selectedGame={selectedGame}
          selectedPlatform={selectedPlatform}
          withVoiceChat={withVoiceChat}
          onClearFilters={handleClearFilter}
          onGameChange={handleGameChange}
          onPlatformChange={handlePlatformChange}
          onVoiceChatChange={handleVoiceChatChange}
        />
      </div>

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
            <ApplicationFilters
              games={games}
              isMobile={true}
              selectedGame={selectedGame}
              selectedPlatform={selectedPlatform}
              withVoiceChat={withVoiceChat}
              onClearFilters={handleClearFilter}
              onGameChange={handleGameChange}
              onPlatformChange={handlePlatformChange}
              onVoiceChatChange={handleVoiceChatChange}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className="relative">
        {isLoading ? (
          <ApplicationsSkeleton />
        ) : applications.length === 0 ? (
          <EmptyState hasFilters={!!selectedGame} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
