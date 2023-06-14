import dynamic from 'next/dynamic';

const Perf = dynamic(
  () =>
    import('r3f-perf').then((mod) => {
      return mod.Perf;
    }),
  { ssr: false }
);

export { Perf };
