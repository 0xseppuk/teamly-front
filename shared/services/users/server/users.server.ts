import 'server-only';

import { GameApplication } from '../../applications/applications.types';

import { User } from '@/shared/types';

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001/api';

interface GetUserByIdResponse {
  user: User;
  applications: GameApplication[];
}

export async function getUserByIdServer(
  id: string,
): Promise<GetUserByIdResponse> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/users/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
