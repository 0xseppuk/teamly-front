import 'server-only';

import { serverFetch } from '@/shared/lib/server-fetch';

import type { Game } from '../games.types';

export interface GamesResponse {
  games: Game[];
  count: number;
}

/**
 * Fetch all games on the server
 * Can be cached with Next.js revalidate
 */
export async function getGamesServer(options?: {
  revalidate?: number;
}): Promise<GamesResponse> {
  return serverFetch<GamesResponse>('/games', {
    next: {
      revalidate: options?.revalidate ?? 3600, // 1 hour default
      tags: ['games'],
    },
  });
}

/**
 * Fetch single game by ID on the server
 */
export async function getGameByIdServer(
  id: string | number,
  options?: { revalidate?: number },
): Promise<Game> {
  return serverFetch<Game>(`/games/${id}`, {
    next: {
      revalidate: options?.revalidate ?? 3600,
      tags: ['games', `game-${id}`],
    },
  });
}
