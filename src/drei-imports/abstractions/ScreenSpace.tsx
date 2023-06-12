import dynamic from 'next/dynamic';

const ScreenSpace = dynamic(
  () =>
    import('@react-three/drei/core/ScreenSpace').then((mod) => {
      return mod.ScreenSpace;
    }),
  { ssr: false }
);

export { ScreenSpace };
