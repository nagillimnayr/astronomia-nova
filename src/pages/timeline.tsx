import { type NextPage } from 'next';
import Head from 'next/head';

const TimelinePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Timeline</title>
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
      <div className="flex h-fit min-h-screen min-w-full flex-col justify-start border-2 border-white">
        <header className="h-fit min-w-full">
          <h1></h1>
        </header>
        <main className="h-fit min-w-full border-2 border-sky-500">
          <div></div>
        </main>
      </div>
    </>
  );
};

export default TimelinePage;
