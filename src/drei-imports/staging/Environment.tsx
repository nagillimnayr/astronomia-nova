import dynamic from 'next/dynamic';

const Environment = dynamic(
  () =>
    import('@react-three/drei/core/Environment').then((mod) => {
      return mod.Environment;
    }),
  { ssr: false }
);

export { Environment };
