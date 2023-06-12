import dynamic from 'next/dynamic';

const Edges = dynamic(
  () =>
    import('@react-three/drei/core/').then((mod) => {
      return mod.Edges;
    }),
  { ssr: false }
);

export { Edges };
