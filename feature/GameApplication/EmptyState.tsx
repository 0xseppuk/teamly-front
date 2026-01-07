'use client';

import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-default-300 bg-default-50/50">
      <CardBody className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="rounded-full bg-default-100 p-4">
          <svg
            className="h-12 w-12 text-default-400"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-semibold">Нет активных заявок</h3>
          <p className="text-sm text-default-500">
            Создайте свою первую заявку, чтобы найти команду для игры. Укажите
            игру, расписание и требования к игрокам.
          </p>
        </div>
        <Button color="secondary" size="lg" onPress={onCreateClick}>
          Создать первую заявку
        </Button>
      </CardBody>
    </Card>
  );
}
