import dynamic from 'next/dynamic';

const Wireframe = dynamic(
  () =>
    import('@react-three/drei/core/Wireframe').then((mod) => {
      return mod.Wireframe;
    }),
  { ssr: false }
);

export { Wireframe };
