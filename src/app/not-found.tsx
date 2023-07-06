import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '~/components/ui/button';

export const metadata: Metadata = {
  title: '404 Not Found',
};
export default function NotFound() {
  return (
    <section className="flex h-full items-center p-16 font-sans dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="max-w-md text-center">
          <h2 className="mb-8 text-9xl font-extrabold dark:text-gray-600">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            {"Sorry, we couldn't find this page."}
          </p>
          <p className="mb-8 mt-4 dark:text-gray-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Button
            asChild
            className="rounded px-8 py-3 font-semibold dark:bg-violet-400 dark:text-gray-900"
          >
            <Link rel="noopener noreferrer" href="/">
              Back to homepage
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
