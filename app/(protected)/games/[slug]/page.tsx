import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Suspense } from 'react';

import {
  ApplicationCard,
  ApplicationFiltersClient,
  EmptyState,
} from '@/feature';
import { CreateApplicationButton } from '@/feature/GameApplication';
import { ClientPagination } from '@/shared';
import { routes } from '@/shared/routes/routes';
import { getAllApplicationsServer } from '@/shared/services/applications/server/applications.server';
import {
  getGameBySlugServer,
  getGamesServer,
} from '@/shared/services/games/server/games.server';

interface GamePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    platform?: string;
    with_voice_chat?: string;
  }>;
}

/**
 * Generate SEO metadata for each game page
 */
export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const game = await getGameBySlugServer(slug);

    const title = `Найти тиммейтов в ${game.name} | Teamly`;
    const description = `Ищите команду и тиммейтов для ${game.name}. Создавайте заявки на поиск игроков или откликайтесь на существующие на Teamly.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        ...(game.icon_url && {
          images: [{ url: game.icon_url, alt: game.name }],
        }),
      },
      alternates: {
        canonical: `https://playteamly.ru${routes.game(slug)}`,
      },
    };
  } catch {
    return {
      title: 'Игра не найдена | Teamly',
    };
  }
}

export const revalidate = 3600;

/**
 * Game page - shows applications filtered by game
 */
export default async function GamePage({
  params,
  searchParams,
}: GamePageProps) {
  const { slug } = await params;
  const filters = await searchParams;

  let game;

  try {
    game = await getGameBySlugServer(slug);
  } catch {
    notFound();
  }

  const [applicationsData, gamesData] = await Promise.all([
    getAllApplicationsServer({
      game_id: String(game.id),
      ...(filters.platform && { platform: filters.platform }),
      ...(filters.with_voice_chat && {
        with_voice_chat: filters.with_voice_chat === 'true',
      }),
    }),
    getGamesServer({ revalidate: 3600 }),
  ]);

  const applications = applicationsData.applications || [];
  const games = gamesData.games || [];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    url: `https://playteamly.ru${routes.game(slug)}`,
    ...(game.icon_url && { image: game.icon_url }),
  };

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        id="game-data"
        type="application/ld+json"
      />
      <div className="container mx-auto">
        <div className="mb-6 flex items-start justify-between md:mb-8">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              Поиск тиммейтов в {game.name}
            </h1>
            <p className="mt-2 text-sm text-default-600 md:text-lg">
              Найди команду для совместной игры в {game.name}
            </p>
          </div>
          <CreateApplicationButton gameId={String(game.id)} />
        </div>

        {/* Filters (platform, voice chat) */}
        <Suspense
          fallback={
            <div className="mb-6 h-14 animate-pulse rounded-lg bg-default-200" />
          }
        >
          <ApplicationFiltersClient
            games={games}
            initialFilters={{
              game_id: String(game.id),
              platform: filters.platform,
              with_voice_chat: filters.with_voice_chat,
            }}
          />
        </Suspense>

        {/* Applications list */}
        <div className="relative">
          {applications.length === 0 ? (
            <EmptyState hasFilters />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </div>
        <ClientPagination perPage={8} total={applications.length} />
      </div>
    </>
  );
}
