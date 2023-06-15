import dynamic from 'next/dynamic';

const Stars = dynamic(
  () =>
    import('@react-three/drei/core/Stars').then((mod) => {
      return mod.Stars;
    }),
  { ssr: false }
);

export { Stars };
