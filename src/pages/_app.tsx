import { type AppType } from 'next/dist/shared/lib/utils';
import '~/styles/globals.css';
import { Roboto } from 'next/font/google';
const roboto = Roboto({ weight: '400', subsets: ['latin'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="min-w-screen m-0 flex h-fit min-h-screen w-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] p-0 text-white">
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
