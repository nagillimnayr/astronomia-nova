import '@/styles/globals.css';
import { type Metadata } from 'next';
import SiteLayout from '@/components/layout/site-layout/SiteLayout';
import Providers from '@/components/layout/site-layout/providers/providers';
import type { CommonProps } from '@/components/props/Props';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon/darkmode/favicon.svg',
  },
};

// Layouts must accept a children prop.
// This will be populated with nested layouts or pages
export default function RootLayout({ children }: CommonProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
