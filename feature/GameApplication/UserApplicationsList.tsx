'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Spacer } from '@heroui/spacer';
import Image from 'next/image';

import { GameApplication, formatTimeRange, getPlatformLabel } from '@/shared';

interface UserApplicationsListProps {
  applications: GameApplication[];
}

export function UserApplicationsList({
  applications,
}: UserApplicationsListProps) {
  if (!applications || applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold text-default-600">
          Нет активных заявок
        </p>
        <p className="mt-2 text-sm text-default-400">
          У пользователя пока нет активных заявок
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Заявки ({applications.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {applications.map((app) => {
          const timeRange = formatTimeRange(
            app.prime_time_start,
            app.prime_time_end,
          );

          return (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
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
                </div>
                <div className="flex gap-2">
                  {app.is_active && (
                    <Chip color="success" size="sm" variant="flat">
                      Активна
                    </Chip>
                  )}
                  {app.is_full && (
                    <Chip color="warning" size="sm" variant="flat">
                      Набор закрыт
                    </Chip>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">{app.description}</p>
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
    </div>
  );
}
