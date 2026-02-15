import { Metadata } from 'next';
import { Suspense } from 'react';

import {
  ApplicationCard,
  ApplicationFiltersClient,
  EmptyState,
} from '@/feature';
import { CreateApplicationButton } from '@/feature/GameApplication';
import { ClientPagination } from '@/shared';
import { getAllApplicationsServer } from '@/shared/services/applications/server/applications.server';
import { getGamesServer } from '@/shared/services/games/server/games.server';

interface SearchParams {
  game_id?: string;
  platform?: string;
  with_voice_chat?: string;
}

interface ApplicationsPageProps {
  searchParams: Promise<SearchParams>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  searchParams,
}: ApplicationsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const filters: string[] = [];

  if (params.game_id) filters.push('игра');
  if (params.platform) filters.push('платформа');
  if (params.with_voice_chat) filters.push('с голосовым чатом');

  const title =
    filters.length > 0
      ? `Заявки: ${filters.join(', ')} | Teamly`
      : 'Все заявки | Teamly';

  const description =
    'Найдите команду для игры или создайте свою заявку. Удобная система подбора игроков.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: 'https://playteamly.ru/applications',
    },
  };
}

/**
 * Server Component - Applications Page
 * Fetches data on the server and streams to the client
 */
export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  // Await searchParams first
  const params = await searchParams;

  // Parallel data fetching - both requests start simultaneously
  const [applicationsData, gamesData] = await Promise.all([
    getAllApplicationsServer({
      ...(params.game_id && { game_id: params.game_id }),
      ...(params.platform && { platform: params.platform }),
      ...(params.with_voice_chat && {
        with_voice_chat: params.with_voice_chat === 'true',
      }),
    }),
    getGamesServer({ limit: 50, revalidate: 3600 }),
  ]);

  const applications = applicationsData.applications || [];
  const games = gamesData.games || [];
  const total = applications.length;

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-start justify-between md:mb-8">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Все заявки</h1>
          <p className="mt-2 text-sm text-default-600 md:text-lg">
            Найди нужную заявку или создай свою
          </p>
        </div>
        <CreateApplicationButton />
      </div>

      {/* Client component for interactive filters */}
      <Suspense
        fallback={
          <div className="mb-6 h-14 animate-pulse rounded-lg bg-default-200" />
        }
      >
        <ApplicationFiltersClient games={games} initialFilters={params} />
      </Suspense>

      {/* Applications list */}
      <div className="relative">
        {applications.length === 0 ? (
          <EmptyState hasFilters={!!params.game_id} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {applications.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
      <ClientPagination perPage={8} total={total} />
    </div>
  );
}
