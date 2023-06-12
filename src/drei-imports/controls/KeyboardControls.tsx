import dynamic from 'next/dynamic';

const KeyboardControls = dynamic(
  () =>
    import('@react-three/drei/web/KeyboardControls').then((mod) => {
      return mod.KeyboardControls;
    }),
  { ssr: false }
);

export { KeyboardControls };
