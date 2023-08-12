import { RADS_90, METER } from '@/simulation/utils/constants';
import { Ring } from '@react-three/drei';
import { useMemo } from 'react';
import { DoubleSide } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { CompassMarker } from './CompassMarker';

const GRID_SECTORS: Readonly<number> = 4;

export const Compass = () => {
  const { radiusSegments, innerRadius, outerRadius, segments } = useMemo(() => {
    const radiusSegments = 10;
    const innerRadius = radiusSegments * METER;
    const outerRadius = innerRadius + innerRadius * 1e-2;
    const segments = 32;
    return {
      radiusSegments,
      innerRadius,
      outerRadius,
      segments,
    };
  }, []);
  return (
    <>
      <object3D>
        <axesHelper args={[innerRadius]} />
        <Ring
          args={[innerRadius, outerRadius, segments]}
          rotation={[-RADS_90, 0, 0]}
        >
          <meshBasicMaterial color={'blue'} side={DoubleSide} />
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
