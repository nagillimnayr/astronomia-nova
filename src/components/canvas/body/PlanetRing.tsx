import { PI_OVER_TWO } from '@/constants/constants';
import { useTexture } from '@react-three/drei';
import { type Object3DNode } from '@react-three/fiber';
import { type PropsWithoutRef, useMemo, useRef } from 'react';
import {
  BufferAttribute,
  DoubleSide,
  type Object3D,
  RingGeometry,
  Vector3,
  type Vector3Tuple,
} from 'three';

export type PlanetRingProps = PropsWithoutRef<
  Object3DNode<Object3D, typeof Object3D>
> & {
  innerRadius: number;
  outerRadius: number;
  rotation?: Vector3Tuple;
};
export const PlanetRing = ({
  innerRadius,
  outerRadius,
  rotation = [0, 0, 0],
  ...props
}: PlanetRingProps) => {
  const ringTexture = useTexture('assets/textures/2k_saturn_ring_alpha.png');

  const geometry = useRef<RingGeometry>(null!);
  geometry.current = useMemo(() => {
    if (geometry.current) {
      geometry.current.dispose();
    }
    const ringGeometry = new RingGeometry(innerRadius, outerRadius, 128);

    const positions = ringGeometry.getAttribute('position');
    const uvs = ringGeometry.getAttribute('uv');
    const pos = new Vector3();

    // Recreate UVs.
    if (!(uvs instanceof BufferAttribute)) return geometry.current;
    const midRadius = innerRadius + (outerRadius - innerRadius) / 2;
    for (let i = 0; i < uvs.count; i++) {
      pos.fromBufferAttribute(positions, i);
      uvs.setXY(i, pos.length() < midRadius ? 0 : 1, 1);
    }

    return ringGeometry;
  }, [innerRadius, outerRadius]);
  return (
    <>
      <object3D rotation={rotation} {...props}>
        <mesh geometry={geometry.current} rotation={[PI_OVER_TWO, 0, 0]}>
          <meshBasicMaterial
            transparent
            map={ringTexture}
            alphaMap={ringTexture}
            side={DoubleSide}
          />
        </mesh>
      </object3D>
    </>
  );
};
