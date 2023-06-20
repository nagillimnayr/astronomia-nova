import { type AppType } from 'next/dist/shared/lib/utils';
import '~/styles/globals.css';
import { MDXProvider } from '@mdx-js/react';
import { Roboto, Orbitron } from 'next/font/google';
import NavBar from '~/components/gui/Navigation/NavBar';
import Footer from '~/components/gui/Footer/Footer';
const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-roboto',
});

const components = {};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MDXProvider components={components}>
      <div
        className={`${roboto.variable} ${orbitron.variable} min-w-screen relative m-0 flex h-fit min-h-screen w-screen flex-col items-center justify-start bg-gray-900 p-0 font-sans text-white`}
      >
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </MDXProvider>
  );
};

export default MyApp;
