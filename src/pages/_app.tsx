import { type AppType } from 'next/dist/shared/lib/utils';
import '~/styles/globals.css';
import { MDXProvider } from '@mdx-js/react';
import { Roboto } from 'next/font/google';
import NavBar from '~/components/gui/Navigation/NavBar';
import Footer from '~/components/gui/Footer/Footer';
const roboto = Roboto({ weight: '400', subsets: ['latin'] });

const components = {};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MDXProvider components={components}>
      <div className="min-w-screen relative m-0 flex h-fit min-h-screen w-screen flex-col items-center justify-start bg-gray-900 p-0 text-white">
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </MDXProvider>
  );
};

export default MyApp;
