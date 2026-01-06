'use client';

import { useGetUserApplications } from '@/shared/services/applications';
import { GameApplication } from '@/shared/services/applications/applications.types';
import { formatTimeRange, getPlatformLabel } from '@/shared/utils';
import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Skeleton } from '@heroui/skeleton';
import { Spacer } from '@heroui/spacer';
import Image from 'next/image';

interface ApplicationsListProps {
  onCreateClick: () => void;
  onEditClick: (application: GameApplication) => void;
  onDeleteClick: (id: string) => void;
}

export function ApplicationsList({
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: ApplicationsListProps) {
  const { data, isLoading } = useGetUserApplications();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full rounded-lg" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const applications = data?.applications || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Мои заявки ({applications.length})</h3>
        <Button color="primary" size="sm" onPress={onCreateClick}>
          + Создать заявку
        </Button>
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
                    src={app.game.icon_url || '/placeholder-game.png'}
                    alt={app.game.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm text-default-500">{app.game.name}</p>
                  <h4 className="font-semibold">{app.title}</h4>
                </div>
                <div className="flex gap-2">
                  {app.is_active && (
                    <Chip size="sm" color="success" variant="flat">
                      Активна
                    </Chip>
                  )}
                  {app.is_full && (
                    <Chip size="sm" color="warning" variant="flat">
                      Набор закрыт
                    </Chip>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">{app.description}</p>
                <Spacer y={3} />
                <div className="flex flex-wrap gap-2">
                  <Chip size="sm" variant="flat" startContent="👥">
                    {app.accepted_players}/{app.max_players} игроков
                  </Chip>
                  <Chip size="sm" variant="flat" startContent="🎮">
                    {getPlatformLabel(app.platform)}
                  </Chip>
                  <Chip size="sm" variant="flat" startContent="🕐">
                    {timeRange}
                  </Chip>
                  {app.with_voice_chat && (
                    <Chip size="sm" variant="flat" startContent="🎤">
                      Голосовой чат
                    </Chip>
                  )}
                </div>
              </CardBody>
              <CardFooter className="gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => onEditClick(app)}
                >
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => onDeleteClick(app.id)}
                >
                  Удалить
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
