import SiteLayout from '@/components/dom/layout/SiteLayout';

import Providers from '@/components/dom/providers/providers';
import { trpc } from '@/helpers/trpc/trpc';
import '@/styles/globals.css';
import { type AppType } from 'next/dist/shared/lib/utils';
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
