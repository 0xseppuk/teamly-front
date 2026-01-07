import 'server-only';

import type {
  ApplicationsResponse,
  GameApplication,
} from '../applications.types';

import { buildQueryString, serverFetch } from '@/shared/lib/server-fetch';

export interface GetApplicationsParams {
  game_id?: string;
  platform?: string;
  with_voice_chat?: boolean;
}

/**
 * Fetch all applications on the server
 * Dynamic data, should not be cached aggressively
 */
export async function getAllApplicationsServer(
  params?: GetApplicationsParams,
): Promise<ApplicationsResponse> {
  const queryString = params
    ? buildQueryString(
        params as Record<string, string | number | boolean | undefined>,
      )
    : '';

  return serverFetch<ApplicationsResponse>(`/applications${queryString}`, {
    cache: 'no-store', // Always fresh data for applications
    next: {
      tags: ['applications'],
    },
  });
}

/**
 * Fetch user's applications on the server
 */
export async function getUserApplicationsServer(): Promise<ApplicationsResponse> {
  return serverFetch<ApplicationsResponse>('/applications/my', {
    cache: 'no-store',
    next: {
      tags: ['my-applications'],
    },
  });
}

/**
 * Fetch single application by ID on the server
 */
export async function getApplicationByIdServer(
  id: string,
): Promise<{ application: GameApplication }> {
  return serverFetch<{ application: GameApplication }>(`/applications/${id}`, {
    cache: 'no-store',
    next: {
      tags: ['applications', `application-${id}`],
    },
  });
}
