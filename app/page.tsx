import { ApplicationCard, Navbar } from '@/feature';
import { getAllApplicationsServer } from '@/shared/services/applications/server';
import { getGamesServer } from '@/shared/services/games/server/games.server';
import type { Metadata } from 'next';
import NextLink from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Найти тиммейтов — поиск команды для онлайн-игр | Teamly',
  description:
    'Teamly — платформа для поиска тиммейтов и создания команд в популярных онлайн-играх. Создавай заявки, находи игроков и общайся с командой.',
  keywords:
    'teamly, поиск команды, тиммейты, найти тиммейтов, cs2, counter-strike 2, dota 2, valorant, apex legends, pubg, поиск игроков, gaming, киберспорт, найти команду для игры',
  openGraph: {
    title: 'Teamly — Найди команду для своей любимой игры',
    description: 'Создавай заявки, находи тиммейтов и общайся с игроками',
    type: 'website',
  },
  alternates: {
    canonical: 'https://playteamly.ru',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = 'force-static';
export const revalidate = 3600;

const gameGradients: Record<string, string> = {
  'Counter-Strike 2': 'from-orange-500 to-yellow-500',
  'Dota 2': 'from-red-500 to-orange-500',
  Valorant: 'from-red-500 to-pink-500',
  'Apex Legends': 'from-red-500 to-orange-400',
  'PUBG: BATTLEGROUNDS': 'from-orange-600 to-yellow-600',
};

export default async function RootPage() {
  const [gamesData, applicationsData] = await Promise.all([
    getGamesServer({ limit: 10, revalidate: 3600 }),
    getAllApplicationsServer({ revalidate: 60 }),
  ]);
  const games = gamesData.games || [];

  const totalGames = gamesData.total || gamesData.count || games.length;

  const applications = applicationsData.applications?.slice(0, 6) || [];

  const gamesStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Поддерживаемые игры',
    numberOfItems: totalGames,
    itemListElement: games.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoGame',
        name: game.name,
        url: `https://playteamly.ru/applications?game_id=${game.id}`,
      },
    })),
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Как найти команду для игры на Teamly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Создайте заявку с указанием игры, времени и требований к игрокам. Другие игроки увидят вашу заявку и откликнутся.',
        },
      },
      {
        '@type': 'Question',
        name: 'Какие игры поддерживает Teamly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Teamly поддерживает Counter-Strike 2, Dota 2, Valorant, Apex Legends, PUBG и другие популярные игры.',
        },
      },
      {
        '@type': 'Question',
        name: 'Бесплатно ли пользоваться Teamly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, создание заявок и поиск тиммейтов полностью бесплатны.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gamesStructuredData),
        }}
        id="games-data"
        type="application/ld+json"
      />
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        id="faq-data"
        type="application/ld+json"
      />
      <div className="min-h-screen bg-black scroll-smooth">
        <div className="sticky top-0 z-50 w-full max-w-[80rem] mx-auto">
          <Navbar />
        </div>

        {/* Hero Section */}
        <section className="max-w-[80rem] mx-auto px-4 py-10 md:py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-default-500 to-default-300 bg-clip-text text-transparent">
              Найди тиммейтов и команду для онлайн-игр
            </h1>
            <p className="text-xl md:text-2xl text-default-500 mb-8 max-w-3xl mx-auto">
              Создавай заявки на поиск тиммейтов в CS2, Dota 2, Valorant, Apex
              Legends и других играх. Находи игроков своего уровня и побеждай
              вместе.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NextLink href="/profile">
                <button className="text-lg px-8 rounded-xl bg-secondary h-[48px] hover:opacity-90 cursor-pointer">
                  Создать заявку
                </button>
              </NextLink>
              <NextLink href="/applications">
                <button className="text-lg px-8 border-2 border-default rounded-xl h-[48px] hover:opacity-90 cursor-pointer">
                  Найти команду
                </button>
              </NextLink>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="max-w-[80rem] mx-auto px-4 py-10 scroll-mt-20"
          id="features"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Почему выбирают Teamly?
            </h2>
            <p className="text-lg text-default-500">
              Все инструменты для поиска команды в одном месте
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-default-200 bg-content1/50 p-8 backdrop-blur-sm hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Быстрый поиск игроков</h3>
              <p className="text-default-500">
                Создай заявку с указанием игры, времени и требований. Получай
                отклики от заинтересованных игроков за минуты.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-default-200 bg-content1/50 p-8 backdrop-blur-sm hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Встроенный чат</h3>
              <p className="text-default-500">
                Общайся с потенциальными тиммейтами прямо на платформе.
                Обсуждайте стратегии и договаривайтесь об игре.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-default-200 bg-content1/50 p-8 backdrop-blur-sm hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Фильтры и платформы</h3>
              <p className="text-default-500">
                Ищи игроков по платформе (PC, консоли), голосовому чату и другим
                параметрам. Находи именно тех, кто тебе нужен.
              </p>
            </div>
          </div>
        </section>

        {/* Latest Applications Section */}
        <section
          className="max-w-[80rem] mx-auto px-4 py-10 scroll-mt-20"
          id="latest-applications"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Последние заявки
            </h2>
            <p className="text-lg text-default-500">
              Игроки уже ищут команду — присоединяйся!
            </p>
          </div>

          {applications.length > 0 ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {applications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
              </div>

              <div className="text-center mt-8">
                <NextLink href="/applications">
                  <button className="text-lg px-8 border-2 border-default rounded-xl h-[48px] cursor-pointer">
                    Посмотреть все заявки
                  </button>
                </NextLink>
              </div>
            </>
          ) : (
            <div className="text-center text-default-500 py-12">
              <p className="mb-4">Пока нет активных заявок</p>
              <NextLink href="/profile">
                <button className="text-lg px-8 rounded-xl bg-secondary h-[48px] hover:opacity-90 cursor-pointer">
                  Создай первую заявку
                </button>
              </NextLink>
            </div>
          )}
        </section>

        {/* Games Section */}
        <section
          className="max-w-[80rem] mx-auto px-4 py-10 scroll-mt-20"
          id="games"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Поддерживаемые игры
            </h2>
            <p className="text-lg text-default-500">
              {totalGames > 0
                ? `${totalGames} ${totalGames === 1 ? 'игра' : totalGames < 5 ? 'игры' : 'игр'} для поиска команды`
                : 'Находи команду для самых популярных онлайн-игр'}
            </p>
          </div>

          {games.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {games.slice(0, 10).map((game) => {
                  const gradient =
                    gameGradients[game.name] || 'from-secondary to-secondary';

                  return (
                    <NextLink
                      key={game.id}
                      className="block aspect-[3/4] rounded-xl border border-default-200 bg-content1/50 p-6 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer relative overflow-hidden group"
                      href={`/applications?game_id=${game.id}`}
                    >
                      {/* Gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                      />

                      {/* Game image if available */}
                      {game.icon_url && (
                        <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                          <img
                            alt={game.name}
                            className="w-full h-full object-cover"
                            src={game.icon_url}
                          />
                        </div>
                      )}

                      {/* Game name */}
                      <div className="relative h-full flex items-end">
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">
                          {game.name}
                        </h3>
                      </div>
                    </NextLink>
                  );
                })}
              </div>

              <div className="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <NextLink href="/games">
                  <button className="text-lg px-8 border-2 border-default rounded-xl h-[48px] hover:opacity-90 cursor-pointer">
                    {totalGames > 10
                      ? `Посмотреть все ${totalGames} ${totalGames < 5 ? 'игры' : 'игр'}`
                      : 'Посмотреть все поддерживаемые игры'}
                  </button>
                </NextLink>
                {totalGames > 10 && (
                  <p className="text-sm text-default-500">
                    Показано {games.length} из {totalGames}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-default-500 py-12">
              <p>Загрузка игр...</p>
            </div>
          )}
        </section>

        {/* How it works */}
        <section
          className="max-w-[80rem] mx-auto px-4 py-10 scroll-mt-20"
          id="how-it-works"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Как это работает?
            </h2>
            <p className="text-lg text-default-500">
              Всего 3 простых шага до игры с командой
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-secondary">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Создай заявку</h3>
              <p className="text-default-500">
                Выбери игру, укажи время и требования к игрокам. Опиши, кого ты
                ищешь в свою команду.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-secondary">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Получай отклики</h3>
              <p className="text-default-500">
                Игроки видят твою заявку и откликаются. Просматривай профили и
                выбирай подходящих тиммейтов.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-secondary">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Играй и побеждай</h3>
              <p className="text-default-500">
                Общайся в чате, договаривайтесь о деталях и отправляйтесь в игру
                вместе. Удачи!
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-[80rem] mx-auto px-4 py-10">
          <div className="rounded-2xl border border-default-200 bg-gradient-to-r from-secondary/10 to-secondary/10 p-12 md:p-20 text-center backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Готов найти свою команду?
            </h2>
            <p className="text-xl text-default-500 mb-8 max-w-2xl mx-auto">
              Присоединяйся к Teamly прямо сейчас и начни играть с лучшими
              игроками
            </p>
            <NextLink href="/login">
              <button className="text-lg px-8 rounded-xl bg-secondary h-[48px] hover:opacity-90 cursor-pointer">
                Начать бесплатно
              </button>
            </NextLink>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-default-200 mt-20">
          <div className="max-w-[80rem] mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">TEAMLY</h3>
                <p className="text-default-500 text-sm">
                  Платформа для поиска команды в онлайн-играх
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Платформа</h4>
                <ul className="space-y-2 text-sm text-default-500">
                  <li>
                    <a
                      className="hover:text-foreground transition-colors"
                      href="#features"
                    >
                      Возможности
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-foreground transition-colors"
                      href="#games"
                    >
                      Игры
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-foreground transition-colors"
                      href="#how-it-works"
                    >
                      Как работает
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Заявки</h4>
                <ul className="space-y-2 text-sm text-default-500">
                  <li>
                    <NextLink
                      className="hover:text-foreground transition-colors"
                      href="/applications"
                    >
                      Все заявки
                    </NextLink>
                  </li>
                  <li>
                    <NextLink
                      className="hover:text-foreground transition-colors"
                      href="/profile"
                    >
                      Создать заявку
                    </NextLink>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Юридическое</h4>
                <ul className="space-y-2 text-sm text-default-500">
                  <li>
                    <NextLink
                      className="hover:text-foreground transition-colors"
                      href="/privacy"
                    >
                      Конфиденциальность
                    </NextLink>
                  </li>
                  <li>
                    <NextLink
                      className="hover:text-foreground transition-colors"
                      href="/terms"
                    >
                      Условия использования
                    </NextLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-default-200 mt-8 pt-8 text-center text-sm text-default-500">
              © 2026 Teamly. Все права защищены.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
