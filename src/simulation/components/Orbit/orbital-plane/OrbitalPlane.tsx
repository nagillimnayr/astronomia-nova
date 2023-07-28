import KeplerBody from '@/simulation/classes/kepler-body';
import { DIST_MULT } from '@/simulation/utils/constants';
import { Circle } from '@react-three/drei';
import { MutableRefObject } from 'react';

type Props = {
  bodyRef: MutableRefObject<KeplerBody>;
  semiMajorAxis: number;
  semiMinorAxis: number;
  linearEccentricity: number;
};
const OrbitalPlane = ({
  bodyRef,
  semiMajorAxis,
  semiMinorAxis,
  linearEccentricity,
}: Props) => {
  return (
    <>
      {bodyRef.current && bodyRef.current.name === 'Earth' ? (
        <>
          <Circle
            args={[semiMajorAxis / DIST_MULT, 1024]}
            position={[-linearEccentricity / DIST_MULT, 0, 0]}
            scale={[1, 1, semiMinorAxis / semiMajorAxis]}
          >
            <meshBasicMaterial color={'white'} opacity={0.2} />
          </Circle>
        </>
      ) : null}
    </>
  );
};

export { OrbitalPlane };
