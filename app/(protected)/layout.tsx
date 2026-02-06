import '@/shared/styles/globals.css';
import { Metadata, Viewport } from 'next';

import { siteConfig } from '@/config/site';
import { Navbar } from '@/feature';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-background" />
      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="container mx-auto max-w-7xl px-4 pt-4 pb-4 flex-1 min-h-0 overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}
