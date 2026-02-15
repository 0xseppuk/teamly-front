import { routes } from '@/shared/routes/routes';
import { getGamesServer } from '@/shared/services/games/server/games.server';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://playteamly.ru';

  let games: Awaited<ReturnType<typeof getGamesServer>>['games'] = [];

  try {
    const gamesData = await getGamesServer({ limit: 100 });
    games = gamesData.games || [];
  } catch {
    // Fallback: generate sitemap without game pages if fetch fails
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/applications`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...games.map((game) => ({
      url: `${baseUrl}${routes.game(game.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ];
}
