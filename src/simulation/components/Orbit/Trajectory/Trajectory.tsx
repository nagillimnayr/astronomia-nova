import { Line } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import {
  type ArrowHelper,
  EllipseCurve,
  Euler,
  Vector3,
  Object3D,
  Matrix4,
} from 'three';
import { getLinearEccentricityFromAxes } from '@/simulation/math/orbital-elements/LinearEccentricity';
import { DIST_MULT } from '@/simulation/utils/constants';
import { useSnapshot } from 'valtio';
import { debugState } from '@/simulation/state/DebugState';
import { degToRad } from 'three/src/math/MathUtils';

const X_UNIT_VECTOR = new Vector3(1, 0, 0);
const rotation = new Euler(Math.PI / 2, 0, 0);

type TrajectoryProps = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  // linearEccentricity?: number;
  orientation: {
    longitudeOfAscendingNode: number;
    argumentOfPeriapsis: number;
    inclination: number;
  };
};

export const Trajectory = ({
  semiMajorAxis,
  semiMinorAxis,
  orientation,
}: TrajectoryProps) => {
  const linearEccentricity = useMemo(() => {
    return getLinearEccentricityFromAxes(semiMajorAxis, semiMinorAxis);
  }, [semiMajorAxis, semiMinorAxis]);

  const points = useMemo(() => {
    return new EllipseCurve(
      -linearEccentricity,
      0,
      semiMajorAxis,
      semiMinorAxis
    ).getSpacedPoints(128);
  }, [semiMajorAxis, semiMinorAxis, linearEccentricity]);

  // const arrowRef = useRef<ArrowHelper>(null!);

  const ref = useRef<Object3D>(null!);

  const debug = useSnapshot(debugState);

  return debug.trajectories ? (
    <>
      <object3D
        ref={(obj) => {
          if (!obj) return;
          ref.current = obj;
          // obj.rotateX(degToRad(90));
          // To orient the orbit correctly, we need to perform three intrinsic rotations. (Intrinsic meaning that the rotations are performed in the local coordinate space, such that when we rotate around the axes in the order z-x-z, the last z-axis rotation is around a different world-space axis than the first one, as the x-axis rotation changes the orientation of the object's local z-axis. For clarity, the rotations will be in the order z-x'-z'', where x' is the new local x-axis after the first rotation and z'' is the object's new local z-axis after the second rotation.)
          obj.rotateZ(degToRad(orientation.longitudeOfAscendingNode));
          obj.rotateX(degToRad(orientation.inclination));
          obj.rotateZ(degToRad(orientation.argumentOfPeriapsis));
        }}
      >
        <Line points={points} color={'white'} lineWidth={1} />

        {/* Semi-major Axis / Periapsis */}
        {/* <arrowHelper
          ref={(arrow) => {
            if (!arrow) return;
            arrowRef.current = arrow;
            arrow.setColor('red');
            arrow.position.set(-linearEccentricity, 0, 0);
            arrow.setDirection(X_UNIT_VECTOR);
            arrow.setLength(semiMajorAxis, 1, 0.25);
          }}
        /> */}
      </object3D>
    </>
  ) : (
    <></>
  );
};
