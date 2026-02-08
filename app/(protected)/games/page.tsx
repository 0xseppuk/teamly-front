import { Metadata } from 'next';
import { Suspense } from 'react';

import { GameCard, GameSearch } from '@/feature/Games';
import { ClientPagination } from '@/shared';
import { getGamesServer } from '@/shared/services/games/server/games.server';

export const metadata: Metadata = {
  title: 'Игры для поиска команды | Teamly',
  description:
    'Выберите игру и найдите тиммейтов. CS2, Dota 2, Valorant, Apex Legends, PUBG и другие популярные онлайн-игры на Teamly.',
  openGraph: {
    title: 'Игры для поиска команды | Teamly',
    description:
      'Выберите игру и найдите тиммейтов для совместной игры',
    type: 'website',
  },
  alternates: {
    canonical: 'https://playteamly.ru/games',
  },
};

interface GamesProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

const GAMES_PER_PAGE = 8;

export default async function GamesPage({ searchParams }: GamesProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || '';

  const data = await getGamesServer({
    page: currentPage,
    limit: GAMES_PER_PAGE,
    search: searchQuery || undefined,
    revalidate: searchQuery ? 0 : 3600,
  });

  const games = data?.games || [];
  const total = data?.total || data?.count || 0;

  return (
    <section className="container mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Выберите игру</h1>
        <p className="mt-2 text-sm text-default-600 md:text-lg">
          Выбери игру которая тебе интересна
        </p>
      </div>

      <Suspense fallback={null}>
        <GameSearch />
      </Suspense>

      {games.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <ClientPagination perPage={GAMES_PER_PAGE} total={total} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-default-500">
            {searchQuery
              ? `По запросу "${searchQuery}" ничего не найдено`
              : 'Игры не найдены'}
          </p>
          {searchQuery && (
            <p className="mt-2 text-sm text-default-400">
              Попробуйте изменить поисковый запрос
            </p>
          )}
        </div>
      )}
    </section>
  );
}
