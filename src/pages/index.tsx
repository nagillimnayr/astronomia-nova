import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { Suspense, useRef } from 'react';
import { LoadingFallback } from '~/components/LoadingFallback';
//import Scene from '~/components/Scene';

const Scene = dynamic(
  () => import('~/components/scenes/Scene').then((mod) => mod.default),
  {
    ssr: false,
  }
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>R3F</title>
        <meta name="description" content="" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon/lightmode/favicon.svg"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon/lightmode/favicon.png"
        />
        {/* <link
          rel="icon"
          type="image/svg+xml"
          sizes="16x16"
          href="/favicon/black/Douglas_College_logo.svg"
        /> */}
      </Head>

      <div className="flex min-h-screen w-full min-w-full flex-col items-center justify-start ">
        <main className="container flex min-h-fit flex-col items-center justify-start gap-12   px-4 py-16">
          {/* Canvas */}

          <div
            id="canvas-holder"
            className="h-min-[42rem] flex h-[42rem] min-w-full flex-col items-center justify-center "
          >
            <Scene />
          </div>

          {/* <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                vulputate faucibus mollis. Nam lorem nisl, porttitor et
                consequat non, consectetur eget magna. Proin facilisis
                consectetur tellus, at porta leo euismod viverra. Cras vulputate
                nec purus in posuere. Proin at dapibus neque. Maecenas vel orci
                non orci mollis aliquam.
              </div>
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas congue faucibus dui quis tempor. Proin ut metus est.
                Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos. Maecenas vel commodo dui. Duis
                sed mi ex.
              </div>
            </div>
          </div> */}
        </main>
      </div>
    </>
  );
};

export default Home;
