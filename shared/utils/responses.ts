import type { ResponseStatus } from '../services/responses/responses.types';

export const getResponseBadgeColor = (
  status?: ResponseStatus,
): 'success' | 'danger' | 'warning' | undefined => {
  if (!status) return undefined;

  switch (status) {
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'warning';
  }
};

export const getResponseBadgeText = (status?: ResponseStatus): string => {
  if (!status) return '';

  switch (status) {
    case 'accepted':
      return 'Принят';
    case 'rejected':
      return 'Отклонен';
    case 'pending':
      return 'Ожидание';
    default:
      return '';
  }
};
