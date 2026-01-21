import { LightBulbIcon } from '@/components/icons';

interface EmptyStateProps {
  hasFilters?: boolean;
}

export function EmptyState({ hasFilters = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-white/10 p-4">
        <LightBulbIcon className="h-10 w-10 text-default-400" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold">Заявок не найдено</h3>
        <p className="text-sm text-default-500">
          {hasFilters
            ? 'Для выбранной игры нет активных заявок. Попробуйте выбрать другую игру.'
            : 'Пока нет активных заявок. Создайте первую!'}
        </p>
      </div>
    </div>
  );
}
