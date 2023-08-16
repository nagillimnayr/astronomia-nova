import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { DIST_MULT, PI_OVER_TWO } from '@/simulation/utils/constants';
import { Ring, useTexture } from '@react-three/drei';
import { DoubleSide } from 'three';

type PlanetRingProps = {
  innerRadius: number;
  outerRadius: number;
};
export const PlanetRing = ({ innerRadius, outerRadius }: PlanetRingProps) => {
  // const ringTexture = useTexture('assets/textures/2k_saturn_ring_alpha.png');

  return (
    <>
      <Ring
        args={[innerRadius / DIST_MULT, outerRadius / DIST_MULT, 64]}
        rotation={[PI_OVER_TWO, 0, 0]}
      >
        <meshBasicMaterial
          // map={ringTexture}
          // alphaMap={ringTexture}
          side={DoubleSide}
        />
      </Ring>
    </>
  );
};
