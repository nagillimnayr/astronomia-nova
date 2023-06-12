import dynamic from 'next/dynamic';

const Hud = dynamic(
  () =>
    import('@react-three/drei/core/Hud').then((mod) => {
      return mod.Hud;
    }),
  { ssr: false }
);

export { Hud };
