'use client';
import { type Metadata } from 'next';
import { Button } from '~/components/ui/button';
import EphemerisForm from '~/components/forms/EphemerisForm';

export const metadata: Metadata = {
  title: 'Test Page',
};
export default function Page() {
  return (
    <section className="container prose mt-8 flex flex-col items-center justify-start">
      <header>
        <h1 className="border-b-2 px-8">Test Page</h1>
      </header>
      <div className="container m-4 flex h-96 flex-col items-center justify-center border-2">
        <EphemerisForm className="rounded-lg border-2 p-4" />
      </div>
    </section>
  );
}
