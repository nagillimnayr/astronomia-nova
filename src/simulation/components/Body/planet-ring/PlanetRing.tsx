import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { DIST_MULT, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Ring, useCursor, useTexture } from '@react-three/drei';
import { Object3DNode } from '@react-three/fiber';
import { PropsWithoutRef, useMemo, useRef, useState } from 'react';
import {
  BufferAttribute,
  DoubleSide,
  Float32BufferAttribute,
  Object3D,
  RingGeometry,
  Texture,
  Vector3,
  Vector3Tuple,
} from 'three';

type PlanetRingProps = PropsWithoutRef<
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
    const vec = new Vector3();
    console.log('attributes:', ringGeometry.attributes);
    const uvs = new Float32Array(positions.count * 2);
    const midRadius = innerRadius + (outerRadius - innerRadius) / 2;
    for (let i = 0; i < positions.count; i++) {
      vec.fromBufferAttribute(positions, i);
      uvs[i] = vec.length() < midRadius ? 0 : 1;
      uvs[i + 1] = 1;
    }
    ringGeometry.setAttribute('uv', new BufferAttribute(uvs, 2));

    return ringGeometry;
  }, [innerRadius, outerRadius]);
  return (
    <>
      <object3D rotation={rotation} {...props}>
        <mesh geometry={geometry.current} rotation={[PI_OVER_TWO, 0, 0]}>
          <meshBasicMaterial
            map={ringTexture}
            // alphaMap={ringTexture}
            side={DoubleSide}
            // map={texture}
          />
        </mesh>
      </object3D>
    </>
  );
};
