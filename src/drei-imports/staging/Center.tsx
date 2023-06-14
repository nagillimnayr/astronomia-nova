import dynamic from 'next/dynamic';

const Center = dynamic(
  () =>
    import('@react-three/drei/core/Center').then((mod) => {
      return mod.Center;
    }),
  { ssr: false }
);

export { Center };
