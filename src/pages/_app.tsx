import { type AppType } from 'next/dist/shared/lib/utils';
import '@/styles/globals.css';

import Providers from '@/components/dom/providers/providers';
import SiteLayout from '@/components/dom/layout/SiteLayout';
import { trpc } from '@/helpers/trpc/trpc';
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
