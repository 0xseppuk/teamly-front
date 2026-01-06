import { GameCard } from '@/feature/Games';
import { getGamesServer } from '@/shared/services/games/server/games.server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teamly - Найдите команду для игры',
  description:
    'Найдите команду для любой игры. Удобная система подбора игроков с фильтрами по платформе, времени и голосовому чату.',
  openGraph: {
    title: 'Teamly - Найдите команду для игры',
    description: 'Удобная система подбора игроков для любой игры',
    type: 'website',
  },
};

/**
 * Home page with Static Site Generation
 * Games are cached and revalidated every hour
 */
export default async function Home() {
  const data = await getGamesServer({ revalidate: 3600 });
  const games = data?.games || [];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold md:text-4xl">Выберите игру</h1>
        <p className="mt-2 text-sm text-default-600 md:text-lg">
          Найдите команду для игры или создайте свою заявку
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
