'use client';

import { Card, CardBody } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import { Spacer } from '@heroui/spacer';
import Image from 'next/image';
import { Control, Controller } from 'react-hook-form';

import { ApplicationFormData } from '../schema';

import { useGetGames } from '@/shared/services/games/games.hooks';

interface GameSelectionStepProps {
  control: Control<ApplicationFormData>;
}

export function GameSelectionStep({ control }: GameSelectionStepProps) {
  const { data: games, isLoading } = useGetGames();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Выберите игру</h3>
        <p className="text-sm text-default-500">
          Для какой игры вы создаете заявку?
        </p>
      </div>
      <Spacer y={2} />
      <Controller
        control={control}
        name="game_id"
        render={({ field, fieldState }) => (
          <div className="space-y-3">
            <div className="grid gap-3 grid-cols-2">
              {games?.games.map((game) => (
                <Card
                  key={game.id}
                  isHoverable
                  isPressable
                  className={`border-2 transition-all ${
                    field.value === game.id.toString()
                      ? 'border-secondary bg-secondary-50/50'
                      : 'border-transparent hover:border-default-300'
                  }`}
                  onPress={() => field.onChange(game.id)}
                >
                  <CardBody className="flex-row items-center gap-4 p-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        fill
                        alt={game.name}
                        className="object-cover"
                        src={game.icon_url || '/placeholder-game.png'}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{game.name}</h4>
                    </div>
                    {field.value === game.id.toString() && (
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
            {fieldState.error && (
              <p className="text-sm text-danger">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}
