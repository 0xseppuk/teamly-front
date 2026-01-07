import { Card, CardBody } from '@heroui/card';

import { LightBulbIcon } from '@/components/icons';

interface EmptyStateProps {
  hasFilters?: boolean;
}

export function EmptyState({ hasFilters = false }: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-default-300 bg-default-50/50">
      <CardBody className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-default-100 p-4">
          <LightBulbIcon className="h-12 w-12 text-default-400" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-semibold">Заявок не найдено</h3>
          <p className="text-sm text-default-500">
            {hasFilters
              ? 'Для выбранной игры нет активных заявок. Попробуйте выбрать другую игру.'
              : 'Пока нет активных заявок. Создайте первую!'}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
