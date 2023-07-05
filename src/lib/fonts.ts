import { Atomic_Age, Roboto, Orbitron } from 'next/font/google';

export const atomicAge = Atomic_Age({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-atomic-age',
});
export const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});
export const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
});
