import { useEffect, useMemo } from 'react';
import { colors } from '../../../../../constants/vr-hud-constants';
import { ColorRepresentation, MeshBasicMaterial, Vector3Tuple } from 'three';
import { Circle, Plane } from '@react-three/drei';
import { PI, PI_OVER_TWO } from '@/constants/constants';

type VRSeparatorProps = {
  // direction?: 'horizontal' | 'vertical';
  position?: Vector3Tuple;
  height: number;
  width: number;
  color?: ColorRepresentation;
  // opacity?: number;
};
export const VRSeparator = ({
  // direction = 'horizontal',
  position,
  height,
  width,
  color = colors.border,
}: // opacity = 1,
VRSeparatorProps) => {
  const material = useMemo(() => {
    return new MeshBasicMaterial();
  }, []);
  useEffect(() => {
    material.color.set(color);
  }, [color, material.color]);

  const rectWidth = width - height;
  const halfWidth = rectWidth / 2;
  const halfHeight = height / 2;
  return (
    <>
      <object3D position={position}>
        <Plane scale-x={rectWidth} scale-y={height} material={material}></Plane>
        <Circle
          args={[1, 32, PI_OVER_TWO, PI]}
          position-x={-halfWidth}
          scale={halfHeight}
          material={material}
        />
        <Circle
          args={[1, 32, 3 * PI_OVER_TWO, PI]}
          position-x={halfWidth}
          scale={halfHeight}
          material={material}
        />
      </object3D>
    </>
  );
};
