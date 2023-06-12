import dynamic from 'next/dynamic';

const Text3D = dynamic(
  () =>
    import('@react-three/drei/core/Text3D').then((mod) => {
      return mod.Text3D;
    }),
  { ssr: false }
);

export { Text3D };
