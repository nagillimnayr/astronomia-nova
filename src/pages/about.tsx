import Head from 'next/head';
import { type NextPage } from 'next';

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About</title>
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
      <div className="h-fit min-h-screen min-w-full border-2 border-white">
        <header className="pl-6 pt-4">
          <h1 className="text-5xl text-white ">About</h1>
        </header>
      </div>
    </>
  );
};

export default About;
