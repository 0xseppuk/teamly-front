import {
  Fira_Code as FontMono,
  IBM_Plex_Mono,
  Rubik,
} from 'next/font/google';

export const fontRubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rubik',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const fontIBM = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm',
  weight: ['400', '500', '600', '700'],
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});
