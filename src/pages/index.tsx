import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { Suspense, useRef } from 'react';
import { LoadingFallback } from '@/components/LoadingFallback';
import Outliner from '@/components/Outliner/Outliner';
//import Scene from '~/components/Scene';

// const CanvasWrapper = dynamic(
//   () => import('@/components/scenes/CanvasWrapper').then((mod) => mod.default),
//   {
//     ssr: false,
//   }
// );
const SolarSystemScene = dynamic(
  () =>
    import('@/components/scenes/SolarSystemScene').then((mod) => mod.default),
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
            <SolarSystemScene />
          </div>

          <div className="flex h-96 min-h-fit w-96 flex-col items-center justify-start">
            <Outliner />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
