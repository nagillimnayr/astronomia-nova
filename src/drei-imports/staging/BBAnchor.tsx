import dynamic from 'next/dynamic';

const BBAnchor = dynamic(
  () =>
    import('@react-three/drei/core/BBAnchor').then((mod) => {
      return mod.BBAnchor;
    }),
  { ssr: false }
);

export { BBAnchor };
