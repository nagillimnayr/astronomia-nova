import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { Suspense, useRef } from 'react';
import { LoadingFallback } from '@/components/LoadingFallback';
import { FullscreenLayout } from '@/components/layout/FullscreenLayout';
//import Scene from '~/components/Scene';

const Scene = dynamic(
  () => import('@/components/scenes/Scene').then((mod) => mod.default),
  {
    ssr: false,
  }
);
const SunEarth = dynamic(
  () =>
    import('@/simulation/components/SolarSystem/SunEarth').then(
      (mod) => mod.default
    ),
  {
    ssr: false,
  }
);

const Page: NextPage = () => {
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

      <FullscreenLayout>
        <Scene>
          <SunEarth />
        </Scene>
      </FullscreenLayout>
    </>
  );
};

export default Page;
