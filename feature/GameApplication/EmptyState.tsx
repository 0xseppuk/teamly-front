'use client';

import { Button } from '@heroui/button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full bg-white/10 p-4">
        <svg
          className="h-10 w-10 text-default-400"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold">Нет активных заявок</h3>
        <p className="text-sm text-default-500">
          Создайте заявку, чтобы найти команду для игры
        </p>
      </div>
      <Button
        className="font-semibold"
        color="secondary"
        size="md"
        onPress={onCreateClick}
      >
        Создать заявку
      </Button>
    </div>
  );
}
