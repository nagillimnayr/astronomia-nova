import dynamic from 'next/dynamic';

const CameraControls = dynamic(
  () =>
    import('@react-three/drei/core/CameraControls').then((mod) => {
      return mod.CameraControls;
    }),
  { ssr: false }
);

export { CameraControls };
