import '@/shared/styles/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import { Providers } from '../shared/providers/providers';

import { fontRubik } from '@/config/fonts';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://playteamly.ru'),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
  },
  openGraph: {
    siteName: 'Teamly',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Teamly — поиск команды для онлайн-игр',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="ru">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Teamly',
              alternateName: 'Найти тиммейтов',
              url: 'https://playteamly.ru',
              description:
                'Найти тиммейтов и команду для любой онлайн-игры. Бесплатная платформа для поиска игроков.',
              potentialAction: {
                '@type': 'SearchAction',
                target:
                  'https://playteamly.ru/games?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
          type="application/ld+json"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
      </head>
      <body
        className={clsx(
          'min-h-screen text-foreground font-rubik antialiased',
          fontRubik.variable,
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
