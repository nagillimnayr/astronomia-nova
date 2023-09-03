import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { DIST_MULT, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Ring, useCursor, useTexture } from '@react-three/drei';
import { Object3DNode } from '@react-three/fiber';
import { PropsWithoutRef, useState } from 'react';
import { DoubleSide, Object3D, Texture, Vector3Tuple } from 'three';

type PlanetRingProps = PropsWithoutRef<
  Object3DNode<Object3D, typeof Object3D>
> & {
  innerRadius: number;
  outerRadius: number;
  texture?: Texture;
  rotation?: Vector3Tuple;
};
export const PlanetRing = ({
  innerRadius,
  outerRadius,
  texture,
  rotation = [0, 0, 0],
  ...props
}: PlanetRingProps) => {
  const ringTexture = useTexture('assets/textures/2k_saturn_ring_alpha.png');

  return (
    <>
      <object3D rotation={rotation} {...props}>
        <Ring
          args={[innerRadius, outerRadius, 64]}
          rotation={[PI_OVER_TWO, 0, 0]}
        >
          <meshBasicMaterial
            map={ringTexture}
            // alphaMap={ringTexture}
            side={DoubleSide}
            // map={texture}
          />
        </Ring>
      </object3D>
    </>
  );
};
