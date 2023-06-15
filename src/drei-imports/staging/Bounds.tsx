import dynamic from 'next/dynamic';

const Bounds = dynamic(
  () =>
    import('@react-three/drei/core/Bounds').then((mod) => {
      return mod.Bounds;
    }),
  { ssr: false }
);

export { Bounds };
