import { type AppType } from 'next/dist/shared/lib/utils';
import '@/styles/globals.css';

import Providers from '@/components/layout/site-layout/providers/providers';
import SiteLayout from '@/components/layout/site-layout/SiteLayout';
import { trpc } from '@/lib/trpc/trpc';
import { StrictMode } from 'react';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <StrictMode>
      <Providers>
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </Providers>
    </StrictMode>
  );
};

export default trpc.withTRPC(MyApp);
