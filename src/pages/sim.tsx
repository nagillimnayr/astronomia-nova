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

const Sim: NextPage = () => {
  return (
    <>
      <Head>
        <title>Solar System</title>
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
      </Head>

      <div className="m-0  flex min-h-screen w-full min-w-full flex-col items-center justify-start p-0">
        <main className="container flex min-h-fit w-full flex-col items-center justify-start   p-0">
          {/* Canvas */}

          <div
            id="canvas-holder"
            className="h-min-screen m-0 flex h-screen w-screen flex-col items-center justify-center p-0"
          >
            <Scene />
          </div>
        </main>
      </div>
    </>
  );
};

export default Sim;
