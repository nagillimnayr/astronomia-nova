import { type NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const VRCanvas = dynamic(
  () => import('@/components/canvas/vr/VRCanvas').then((mod) => mod.VRCanvas),
  {
    ssr: false,
  }
);

const VRPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Astronomia Nova</title>
        <meta name="description" content="" />
      </Head>

      <main className="h-full w-full">
        <VRCanvas />
      </main>
    </>
  );
};

export default VRPage;
