import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

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
        <title>Astronomia Nova</title>
        <meta name="description" content="" />
        {/* <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon/lightmode/favicon.svg"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon/lightmode/favicon.png"
        /> */}
      </Head>

      <main className="h-full w-full">
        <SolarSystemScene />
      </main>
    </>
  );
};

export default Home;
