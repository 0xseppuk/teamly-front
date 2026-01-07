'use client';

import { Spinner } from '@heroui/spinner';
import { useMemo, useState } from 'react';

import { ResponseItem } from './ResponseItem';
import { ResponseStatusTabs } from './ResponseStatusTabs';

import {
  ApplicationResponseWithMessage,
  ResponseStatus,
} from '@/shared/services/responses/responses.types';

interface ResponsesListProps {
  responses: ApplicationResponseWithMessage[];
  isLoading?: boolean;
}

export function ResponsesList({ responses, isLoading }: ResponsesListProps) {
  const [selectedStatus, setSelectedStatus] = useState<ResponseStatus | 'all'>(
    'all',
  );

  // Calculate counts for each status
  const counts = useMemo(() => {
    const all = responses.length;
    const pending = responses.filter((r) => r.status === 'pending').length;
    const accepted = responses.filter((r) => r.status === 'accepted').length;
    const rejected = responses.filter((r) => r.status === 'rejected').length;

    return { all, pending, accepted, rejected };
  }, [responses]);

  // Filter responses based on selected status
  const filteredResponses = useMemo(() => {
    if (selectedStatus === 'all') return responses;

    return responses.filter((r) => r.status === selectedStatus);
  }, [responses, selectedStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold text-default-600">
          Пока нет откликов
        </p>
        <p className="mt-2 text-sm text-default-400">
          Отклики появятся, когда игроки откликнутся на вашу заявку
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ResponseStatusTabs
        counts={counts}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {filteredResponses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-default-500">
            Нет откликов с таким статусом
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredResponses.map((response) => (
            <ResponseItem key={response.id} response={response} />
          ))}
        </div>
      )}
    </div>
  );
}
