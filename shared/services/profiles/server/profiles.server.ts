import 'server-only';

import type { User } from '@/shared/types';

import { serverFetch } from '@/shared/lib/server-fetch';

/**
 * Get current authenticated user on the server
 * Returns null if not authenticated
 */
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const response = await serverFetch<{ user: User }>('/auth/me', {
      cache: 'no-store', // Always get fresh user data
      next: {
        tags: ['current-user'],
      },
    });

    return response.user;
  } catch (error) {
    // User not authenticated or error occurred

    return null;
  }
}
