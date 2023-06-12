import dynamic from 'next/dynamic';

const Select = dynamic(
  () =>
    import('@react-three/drei/web/Select').then((mod) => {
      return mod.Select;
    }),
  { ssr: false }
);

export { Select };
