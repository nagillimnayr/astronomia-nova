import dynamic from 'next/dynamic';

const Html = dynamic(
  () =>
    import('@react-three/drei/web/Html').then((mod) => {
      return mod.Html;
    }),
  { ssr: false }
);

export { Html };
