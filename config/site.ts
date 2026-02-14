export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Teamly',
  description:
    'Найти тиммейтов и команду для любой онлайн-игры. Создавай заявки на поиск игроков и играй вместе.',
  publicNavItems: [
    {
      label: 'Главная',
      href: '/',
    },
    {
      label: 'Заявки',
      href: '/applications',
    },
    {
      label: 'Игры',
      href: '/games',
    },
  ],
  privateNavItems: [
    {
      label: 'Профиль',
      href: '/profile',
    },
  ],
};
