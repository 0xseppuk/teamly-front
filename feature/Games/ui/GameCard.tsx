'use client';

import { Card, CardBody } from '@heroui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Game } from '@/shared/services/games/games.types';

interface GameCardProps {
  game: Game;
}

/**
 * Game card component with image fallback handling
 */
export function GameCard({ game }: GameCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    router.push(`/applications?game_id=${game.id}`);
  };

  return (
    <Card
      isPressable
      className="transition-all hover:scale-105 hover:shadow-xl"
      onPress={handleClick}
    >
      <CardBody className="p-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-default-100">
          {!imageError && game.icon_url ? (
            <Image
              fill
              alt={game.name}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={game.icon_url}
              unoptimized={game.icon_url.startsWith('http')}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-default-100 to-default-200">
              <div className="text-center">
                <div className="mb-2 text-4xl">🎮</div>
                <p className="px-4 text-sm font-medium text-default-600">
                  {game.name}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 md:p-4">
          <h3 className="text-lg font-semibold md:text-xl">{game.name}</h3>
          {game.slug && (
            <p className="mt-1 text-xs text-default-500 md:text-sm">
              {game.slug}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
