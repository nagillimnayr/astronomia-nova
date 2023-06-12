import dynamic from 'next/dynamic';

const Billboard = dynamic(
  () =>
    import('@react-three/drei/core/Billboard').then((mod) => {
      return mod.Billboard;
    }),
  { ssr: false }
);

export { Billboard };
