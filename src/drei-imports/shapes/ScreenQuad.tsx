import dynamic from 'next/dynamic';

export const ScreenQuad = dynamic(
  () =>
    import('@react-three/drei/core/ScreenQuad').then((mod) => {
      return mod.ScreenQuad;
    }),
  { ssr: false }
);
