import { type NextPage } from 'next';
import Head from 'next/head';
import Timeline from '@/components/Timeline/Timeline';
//import { Timeline } from 'flowbite-react';

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
        <header className=" my-4 ml-6 h-fit min-w-full">
          <h1 className="text-5xl ">Timeline</h1>
        </header>
        <main className="h-fit min-w-full border-2 border-sky-500 p-4">
          <div>
            {/* <Timeline>
              <Timeline.Item>
                <Timeline.Time>June 9th, 2022</Timeline.Time>
                <Timeline.Title>Title of Entry</Timeline.Title>
                <Timeline.Body>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </Timeline.Body>
              </Timeline.Item>
            </Timeline> */}

            <Timeline />
          </div>
        </main>
      </div>
    </>
  );
};

export default TimelinePage;
