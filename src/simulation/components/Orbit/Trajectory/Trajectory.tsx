import { Line } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  type ArrowHelper,
  EllipseCurve,
  Euler,
  Vector3,
  type Object3D,
  Vector3Tuple,
} from 'three';
import { getLinearEccentricityFromAxes } from '@/simulation/math/orbital-elements/LinearEccentricity';
import { degToRad } from 'three/src/math/MathUtils';

import { useActor, useSelector } from '@xstate/react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { cn } from '@/lib/cn';
import { DIST_MULT, X_AXIS } from '@/simulation/utils/constants';
import { OrbitalPlane } from '../orbital-plane/OrbitalPlane';
import KeplerBody from '@/simulation/classes/kepler-body';
import { Object3DNode, MaterialNode, extend } from '@react-three/fiber';
import { flatten } from 'lodash';

const NUM_OF_POINTS = 2048;

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

type TrajectoryProps = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  periapsis: number;
  linearEccentricity: number;
  // orientation: {
  //   longitudeOfAscendingNode: number;
  //   argumentOfPeriapsis: number;
  //   inclination: number;
  // };
  bodyRef: MutableRefObject<KeplerBody | null>;
};

export const Trajectory = ({
  semiMajorAxis,
  semiMinorAxis,
  linearEccentricity,
  periapsis,
  bodyRef,
}: TrajectoryProps) => {
  // Check if trajectory visibility is on.
  const { visibilityActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const trajectories = useSelector(
    visibilityActor,
    ({ context }) => context.trajectories
  );
  const trajectoryVisibilityOn = useSelector(trajectories, (state) =>
    state.matches('active')
  );
  const surfaceView = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const [showPeriapsis, setShowPeriapsis] = useState<boolean>(false);

  // const points = useMemo(() => {
  //   const points = new EllipseCurve(
  //     -linearEccentricity / DIST_MULT,
  //     0,
  //     semiMajorAxis / DIST_MULT,
  //     semiMinorAxis / DIST_MULT
  //   )
  //     .getSpacedPoints(1024)
  //     .map((vec2) => {
  //       const vec3Tuple: Vector3Tuple = [vec2.x, vec2.y, 0];
  //       return vec3Tuple;
  //     });
  //   return flatten(points);
  // }, [semiMajorAxis, semiMinorAxis, linearEccentricity]);
  const points = useMemo(() => {
    const points = new EllipseCurve(
      -linearEccentricity / DIST_MULT,
      0,
      semiMajorAxis / DIST_MULT,
      semiMinorAxis / DIST_MULT
    ).getSpacedPoints(NUM_OF_POINTS);
    return points;
  }, [semiMajorAxis, semiMinorAxis, linearEccentricity]);

  const arrowRef = useRef<ArrowHelper>(null!);

  const ref = useRef<Object3D>(null!);

  let isVisible = trajectoryVisibilityOn;
  if (bodyRef.current && focusTarget) {
    if (focusTarget === bodyRef.current && surfaceView) {
      isVisible = false;
    }
  }
  return (
    <>
      <object3D
        visible={isVisible}
        ref={(obj) => {
          if (!obj) return;
          if (ref.current === obj) return;
          ref.current = obj;
        }}
      >
        <Line points={points} color={'white'} lineWidth={2} />
        {/* <mesh>
          <meshLineGeometry points={points} />
          <meshLineMaterial color={'white'} />
        </mesh> */}

        {/* Semi-major Axis / Periapsis */}
        {showPeriapsis ? (
          <arrowHelper
            ref={(arrow) => {
              if (!arrow) return;
              arrowRef.current = arrow;
              arrow.setColor('red');
              // arrow.position.set(-linearEccentricity  / DIST_MULT, 0, 0);
              arrow.setDirection(X_AXIS);
              // arrow.setLength(semiMajorAxis  / DIST_MULT, 1, 0.25);
              arrow.setLength(periapsis / DIST_MULT, 1, 0.25);
            }}
          />
        ) : null}
      </object3D>
    </>
  );
};
