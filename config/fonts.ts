import {
  Fira_Code as FontMono,
  Inter as FontSans,
  IBM_Plex_Mono,
} from 'next/font/google';

export const fontIBM = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});
