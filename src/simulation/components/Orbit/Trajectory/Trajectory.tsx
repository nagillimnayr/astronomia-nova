import { Line } from '@react-three/drei';
import { useContext, useMemo, useRef } from 'react';
import {
  type ArrowHelper,
  EllipseCurve,
  Euler,
  Vector3,
  type Object3D,
} from 'three';
import { getLinearEccentricityFromAxes } from '@/simulation/math/orbital-elements/LinearEccentricity';
import { degToRad } from 'three/src/math/MathUtils';

import { useActor } from '@xstate/react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { cn } from '@/lib/cn';

const _xAxis = new Vector3(1, 0, 0);

type TrajectoryProps = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  periapsis: number;
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
  periapsis,
  orientation,
}: TrajectoryProps) => {
  // Check if trajectory visibility is on.
  const { trajectoryVis } = useContext(GlobalStateContext);
  const [state] = useActor(trajectoryVis);
  const isVisible = state.matches('active');

  const bodyRef = useContext(KeplerTreeContext);

  const linearEccentricity = useMemo(() => {
    return getLinearEccentricityFromAxes(semiMajorAxis, semiMinorAxis);
  }, [semiMajorAxis, semiMinorAxis]);

  const points = useMemo(() => {
    return new EllipseCurve(
      -linearEccentricity,
      0,
      semiMajorAxis,
      semiMinorAxis
    ).getSpacedPoints(1024);
  }, [semiMajorAxis, semiMinorAxis, linearEccentricity]);

  const arrowRef = useRef<ArrowHelper>(null!);

  const ref = useRef<Object3D>(null!);
  return (
    <>
      <object3D
        visible={isVisible}
        ref={(obj) => {
          if (!obj) return;
          if (ref.current === obj) return;
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
            // arrow.position.set(-linearEccentricity, 0, 0);
            arrow.setDirection(_xAxis);
            // arrow.setLength(semiMajorAxis, 1, 0.25);
            arrow.setLength(periapsis, 1, 0.25);
          }}
        /> */}
      </object3D>
    </>
  );
};
