import dynamic from 'next/dynamic';

const Sky = dynamic(
  () =>
    import('@react-three/drei/core/Sky').then((mod) => {
      return mod.Sky;
    }),
  { ssr: false }
);

export { Sky };
