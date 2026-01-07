'use client';

import { Tab, Tabs } from '@heroui/tabs';

import { ResponseStatus } from '@/shared/services/responses/responses.types';

interface ResponseStatusTabsProps {
  selectedStatus: ResponseStatus | 'all';
  onStatusChange: (status: ResponseStatus | 'all') => void;
  counts: {
    all: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
}

export function ResponseStatusTabs({
  selectedStatus,
  onStatusChange,
  counts,
}: ResponseStatusTabsProps) {
  return (
    <Tabs
      aria-label="Фильтр по статусу откликов"
      selectedKey={selectedStatus}
      size="sm"
      variant="underlined"
      onSelectionChange={(key) => onStatusChange(key as ResponseStatus | 'all')}
    >
      <Tab key="all" title={`Все (${counts.all})`} />
      <Tab key="pending" title={`🟡 Ожидают (${counts.pending})`} />
      <Tab key="accepted" title={`🟢 Приняты (${counts.accepted})`} />
      <Tab key="rejected" title={`🔴 Отклонены (${counts.rejected})`} />
    </Tabs>
  );
}
