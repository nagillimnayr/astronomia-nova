import { type AppType } from 'next/dist/shared/lib/utils';
import '@/styles/globals.css';

import Providers from '@/components/layout/site-layout/providers/providers';
import SiteLayout from '@/components/layout/site-layout/SiteLayout';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Providers>
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </Providers>
  );
};

export default MyApp;
