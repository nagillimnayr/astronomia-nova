import dynamic from 'next/dynamic';

const PerformanceMonitor = dynamic(
  () =>
    import('@react-three/drei/core/PerformanceMonitor').then((mod) => {
      return mod.PerformanceMonitor;
    }),
  { ssr: false }
);

export { PerformanceMonitor };
