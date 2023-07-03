import { type AppType } from 'next/dist/shared/lib/utils';
import '~/styles/globals.css';
import { MDXProvider } from '@mdx-js/react';
import { Atomic_Age, Roboto, Orbitron } from 'next/font/google';
import NavBar from '~/components/layout/site-layout/Navigation/NavBar';
import Footer from '~/components/layout/site-layout/Footer/Footer';
const atomicAge = Atomic_Age({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-atomic-age',
});
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
        className={`${roboto.variable} ${orbitron.variable} ${atomicAge.variable} min-w-screen relative m-0 flex h-fit min-h-screen w-screen flex-col items-center justify-start bg-primary p-0 font-sans text-white`}
      >
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </MDXProvider>
  );
};

export default MyApp;
