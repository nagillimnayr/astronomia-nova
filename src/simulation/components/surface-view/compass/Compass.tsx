import { RADS_90, METER } from '@/simulation/utils/constants';
import { Ring } from '@react-three/drei';
import { useMemo } from 'react';
import { DoubleSide } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { CompassMarker } from './CompassMarker';

// Raise off the ground a little to prevent clipping
const DIST_OFF_GROUND: Readonly<number> = METER * 1e-1;

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
        <Ring
          args={[innerRadius, outerRadius, segments]}
          rotation={[-RADS_90, 0, 0]}
        >
          <meshBasicMaterial color={'blue'} />
        </Ring>
        {/* <polarGridHelper args={[innerRadius, GRID_SECTORS, radiusSegments]} /> */}

        <CompassMarker position={[-innerRadius, 0, 0]}>N</CompassMarker>
        <CompassMarker position={[innerRadius, 0, 0]}>S</CompassMarker>
        <CompassMarker position={[0, 0, innerRadius]}>W</CompassMarker>
        <CompassMarker position={[0, -0, -innerRadius]}>E</CompassMarker>
      </object3D>
    </>
  );
};
