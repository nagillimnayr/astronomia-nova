import { BufferGeometryNode } from '@react-three/fiber';
import { extend } from '@react-three/fiber';
import { RoundedPlaneGeometry } from 'maath/geometry';
import { useMemo, type ReactNode } from 'react';

extend({ RoundedPlaneGeometry });
declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedPlaneGeometry: BufferGeometryNode<
      RoundedPlaneGeometry,
      typeof RoundedPlaneGeometry
    >;
  }
}

interface RoundedRectProps {
  width?: number;
  height?: number;
  radius?: number;
  segments?: number;
  children?: ReactNode;
}
export const RoundedRect = ({
  width,
  height,
  radius,
  segments,
  children,
}: RoundedRectProps) => {
  const geometry = useMemo(() => {
    return new RoundedPlaneGeometry(width, height, radius, segments);
  }, [height, radius, segments, width]);

  return (
    <>
      <mesh geometry={geometry}>{children}</mesh>
    </>
  );
};
