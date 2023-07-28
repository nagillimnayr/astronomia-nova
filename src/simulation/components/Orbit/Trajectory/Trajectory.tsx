import { Line } from '@react-three/drei';
import { useContext, useMemo, useRef, useState } from 'react';
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
import { DIST_MULT } from '@/simulation/utils/constants';
import { OrbitalPlane } from '../orbital-plane/OrbitalPlane';

const _xAxis = new Vector3(1, 0, 0);

type TrajectoryProps = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  periapsis: number;
  linearEccentricity: number;
  orientation: {
    longitudeOfAscendingNode: number;
    argumentOfPeriapsis: number;
    inclination: number;
  };
};

export const Trajectory = ({
  semiMajorAxis,
  semiMinorAxis,
  linearEccentricity,
  periapsis,
  orientation,
}: TrajectoryProps) => {
  // Check if trajectory visibility is on.
  const { trajectoryVis } = useContext(GlobalStateContext);
  const [state] = useActor(trajectoryVis);
  const isVisible = state.matches('active');

  const [showPeriapsis, setShowPeriapsis] = useState<boolean>(false);

  const points = useMemo(() => {
    return new EllipseCurve(
      -linearEccentricity / DIST_MULT,
      0,
      semiMajorAxis / DIST_MULT,
      semiMinorAxis / DIST_MULT
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
          // obj.rotateZ(degToRad(orientation.longitudeOfAscendingNode));
          // obj.rotateX(degToRad(orientation.inclination));
          // obj.rotateZ(degToRad(orientation.argumentOfPeriapsis));
        }}
      >
        <Line points={points} color={'white'} lineWidth={1} />
        {/* {bodyRef ? (
          <OrbitalPlane
            semiMajorAxis={semiMajorAxis}
            semiMinorAxis={semiMinorAxis}
            linearEccentricity={linearEccentricity}
            bodyRef={bodyRef}
          />
        ) : null} */}
        {/* Semi-major Axis / Periapsis */}
        {showPeriapsis ? (
          <arrowHelper
            ref={(arrow) => {
              if (!arrow) return;
              arrowRef.current = arrow;
              arrow.setColor('red');
              // arrow.position.set(-linearEccentricity  / DIST_MULT, 0, 0);
              arrow.setDirection(_xAxis);
              // arrow.setLength(semiMajorAxis  / DIST_MULT, 1, 0.25);
              arrow.setLength(periapsis / DIST_MULT, 1, 0.25);
            }}
          />
        ) : null}
      </object3D>
    </>
  );
};
