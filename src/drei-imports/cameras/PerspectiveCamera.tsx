import dynamic from 'next/dynamic';

const PerspectiveCamera = dynamic(
  () =>
    import('@react-three/drei/core/PerspectiveCamera').then((mod) => {
      return mod.PerspectiveCamera;
    }),
  { ssr: false }
);

export { PerspectiveCamera };
