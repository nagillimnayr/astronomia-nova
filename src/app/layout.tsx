import '~/styles/globals.css';
import { Metadata } from 'next';
import SiteLayout from '~/components/layout/site-layout/SiteLayout';
import Providers from '~/components/layout/site-layout/providers/providers';
import type { Props } from '~/components/props/Props';

// export const metadata: Metadata = {
//   icons: {
//     icon: '/favicon.ico',
//   },
// };

// Layouts must accept a children prop.
// This will be populated with nested layouts or pages
export default function RootLayout({ children }: Props) {
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
