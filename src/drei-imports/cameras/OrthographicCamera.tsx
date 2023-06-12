import dynamic from 'next/dynamic';

const OrthographicCamera = dynamic(
  () =>
    import('@react-three/drei/core/OrthographicCamera').then((mod) => {
      return mod.OrthographicCamera;
    }),
  { ssr: false }
);

export { OrthographicCamera };
