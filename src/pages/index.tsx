import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const SolarSystemScene = dynamic(
  () =>
    import('@/components/canvas/scene/SolarSystemScene').then(
      (mod) => mod.default
    ),
  {
    ssr: false,
  }
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Astronomia Nova</title>
        <meta name="description" content="" />
      </Head>

      <main className="h-full w-full">
        <SolarSystemScene />
      </main>
    </>
  );
};

export default Home;
