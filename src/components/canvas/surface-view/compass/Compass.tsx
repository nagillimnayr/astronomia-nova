import { METER, PI_OVER_TWO } from '@/constants/constants';
import { Ring } from '@react-three/drei';
import { useMemo } from 'react';
import { CompassMarker } from './CompassMarker';

// Raise off the ground a little to prevent clipping
const DIST_OFF_GROUND: Readonly<number> = METER * 5e-1;

export const Compass = () => {
  const { innerRadius, outerRadius, segments } = useMemo(() => {
    const innerRadius = 50 * METER;
    const outerRadius = innerRadius + innerRadius * 1e-2;
    const segments = 64;
    return {
      innerRadius,
      outerRadius,
      segments,
    };
  }, []);
  return (
    <>
      <object3D position={[0, DIST_OFF_GROUND, 0]}>
        {/* <axesHelper args={[innerRadius]} /> */}
        {/* <Ring
          args={[innerRadius, outerRadius, segments]}
          rotation={[-PI_OVER_TWO, 0, 0]}
        >
          <meshBasicMaterial color={'blue'} />
        </Ring> */}
        {/* <polarGridHelper args={[innerRadius, GRID_SECTORS, radiusSegments]} /> */}

        <CompassMarker position={[-innerRadius, 0, 0]}>N</CompassMarker>
        <CompassMarker position={[innerRadius, 0, 0]}>S</CompassMarker>
        <CompassMarker position={[0, 0, innerRadius]}>W</CompassMarker>
        <CompassMarker position={[0, -0, -innerRadius]}>E</CompassMarker>
      </object3D>
    </>
  );
};
