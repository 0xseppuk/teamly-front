export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Teamly',
  description: 'Платформа для поиска команды в онлайн-играх',
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
