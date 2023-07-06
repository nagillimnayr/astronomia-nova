import { Button } from '~/components/ui/button';

export default function Page() {
  return (
    <section className="container prose mt-8 flex flex-col items-center justify-start">
      <header>
        <h1 className="border-b-2 px-8">Test Page</h1>
      </header>
      <div className="container m-4 flex h-96 flex-col items-center justify-center border-2">
        <Button>Save to file</Button>
      </div>
    </section>
  );
}
