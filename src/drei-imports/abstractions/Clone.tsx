import dynamic from 'next/dynamic';

const Clone = dynamic(
  () =>
    import('@react-three/drei/core/Clone').then((mod) => {
      return mod.Clone;
    }),
  { ssr: false }
);

export { Clone };
