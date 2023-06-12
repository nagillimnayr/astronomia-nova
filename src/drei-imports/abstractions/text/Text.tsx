import dynamic from 'next/dynamic';

const Text = dynamic(
  () =>
    import('@react-three/drei/core/Text').then((mod) => {
      return mod.Text;
    }),
  { ssr: false }
);

export { Text };
