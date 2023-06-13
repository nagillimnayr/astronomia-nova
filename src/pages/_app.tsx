import { type AppType } from 'next/dist/shared/lib/utils';
import '~/styles/globals.css';
import { Roboto } from 'next/font/google';
const roboto = Roboto({ weight: '400', subsets: ['latin'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
