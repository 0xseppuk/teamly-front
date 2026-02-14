import 'server-only';

import type { Game } from '../games.types';

import { buildQueryString, serverFetch } from '@/shared/lib/server-fetch';

export interface GamesResponse {
  games: Game[];
  count: number;
  total?: number;
}

export interface GetGamesParams {
  page?: number;
  limit?: number;
  search?: string;
  revalidate?: number;
}

/**
 * Fetch all games on the server
 * Can be cached with Next.js revalidate
 */
export async function getGamesServer(
  options?: GetGamesParams,
): Promise<GamesResponse> {
  const { revalidate, ...params } = options || {};
  const queryString = buildQueryString(
    params as Record<string, string | number | boolean | undefined>,
  );

  return serverFetch<GamesResponse>(`/games${queryString}`, {
    next: {
      revalidate: revalidate ?? 3600, // 1 hour default
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

/**
 * Fetch single game by slug on the server
 */
export async function getGameBySlugServer(
  slug: string,
  options?: { revalidate?: number },
): Promise<Game> {
  return serverFetch<Game>(`/games/slug/${slug}`, {
    next: {
      revalidate: options?.revalidate ?? 3600,
      tags: ['games', `game-slug-${slug}`],
    },
  });
}
