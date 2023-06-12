import dynamic from 'next/dynamic';

const Stats = dynamic(
  () =>
    import('@react-three/drei/core/Stats').then((mod) => {
      return mod.Stats;
    }),
  { ssr: false }
);

export { Stats };
