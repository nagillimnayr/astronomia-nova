import { makeAnnularCylinderGeometry } from '@/helpers/geometry/annular-cylinder';
import { type Object3DProps } from '@react-three/fiber';
import { useMemo } from 'react';

type AnnularCylinderProps = {
  innerRadius: number;
  outerRadius: number;
  depth?: number;
} & Pick<Object3DProps, 'children' | 'position' | 'scale' | 'rotation'>;
export const AnnularCylinder = ({
  children,
  innerRadius,
  outerRadius,
  depth = 1,
  ...props
}: AnnularCylinderProps) => {
  const geometry = useMemo(() => {
    const segments = 32;
    return makeAnnularCylinderGeometry(outerRadius, innerRadius, {
      bevelEnabled: false,
      curveSegments: segments,
      depth: depth,
      // steps: 6,
    });
  }, [depth, innerRadius, outerRadius]);
  return (
    <mesh {...props} geometry={geometry}>
      {children}
    </mesh>
  );
};
