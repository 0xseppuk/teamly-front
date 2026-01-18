'use client';

import type { ThemeProviderProps } from 'next-themes';

import { HeroUIProvider } from '@heroui/system';
import { ToastProvider } from '@heroui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const recapchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_TOKEN;

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleReCaptchaProvider reCaptchaKey={recapchaKey ?? ''}>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>
            {children}
            <ToastProvider />
          </NextThemesProvider>
        </HeroUIProvider>
      </GoogleReCaptchaProvider>
    </QueryClientProvider>
  );
}
