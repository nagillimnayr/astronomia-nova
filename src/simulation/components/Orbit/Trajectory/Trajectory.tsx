/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Line, Segment, Segments } from '@react-three/drei';
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
  Vector2,
} from 'three';
import { getLinearEccentricityFromAxes } from '@/simulation/math/orbital-elements/LinearEccentricity';
import { degToRad, generateUUID } from 'three/src/math/MathUtils';

import { useActor, useSelector } from '@xstate/react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import { cn } from '@/lib/cn';
import { DIST_MULT, METER, X_AXIS } from '@/simulation/utils/constants';
import { OrbitalPlane } from '../orbital-plane/OrbitalPlane';
import KeplerBody from '@/simulation/classes/kepler-body';
import {
  Object3DNode,
  MaterialNode,
  extend,
  useFrame,
  useThree,
} from '@react-three/fiber';
import { flatten } from 'lodash';
import { useSpring, animated } from '@react-spring/three';
import { Line2 } from 'three-stdlib';
import { anim } from '../../animated-components';
import { useXR } from '@react-three/xr';

const DIST_TO_CAM_THRESHOLD = 1e8 * METER;

const NUM_OF_POINTS = 2 ** 14;

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();

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
  // const getThree = useThree(({ get }) => get);
  // const size = useThree(({ size }) => size);

  const arrowRef = useRef<ArrowHelper>(null!);
  const objRef = useRef<Object3D>(null!);
  const lineRef = useRef<Line2>(null!);

  const [showPeriapsis, setShowPeriapsis] = useState<boolean>(false);

  // const points = useMemo(() => {
  //   const points = new EllipseCurve(
  //     -linearEccentricity / DIST_MULT,
  //     0,
  //     semiMajorAxis / DIST_MULT,
  //     semiMinorAxis / DIST_MULT
  //   )
  //     .getSpacedPoints(NUM_OF_POINTS)
  //     .map((vec2) => {
  //       // const vec3Tuple: Vector3Tuple = [vec2.x, 0, vec2.y];
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

  // const geometry = useMemo(() => {
  //   return new MeshLineGeometry();
  // }, []);

  // useEffect(() => {
  //   geometry.setPoints(points);
  // }, [geometry, points]);

  // const material = useMemo(() => {
  //   const { size } = getThree();
  //   const material = new MeshLineMaterial({
  //     lineWidth: 10,
  //     sizeAttenuation: 0,
  //     resolution: new Vector2(size.width, size.height),
  //   });
  //   return material;
  // }, [getThree]);

  // useEffect(() => {
  //   /** @ts-ignore */
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  //   material.uniforms.resolution!.value.set(size.width, size.height);
  // }, [size, material]);

  let isVisible = trajectoryVisibilityOn;
  if (bodyRef.current && focusTarget) {
    if (focusTarget === bodyRef.current && surfaceView) {
      isVisible = false;
    }
  }

  const [spring, springRef] = useSpring(() => ({ opacity: 1 }));

  // useFrame(({ camera }) => {
  //   // Get focus target.
  //   const { focusTarget } = cameraActor.getSnapshot()!.context;
  //   if (!focusTarget) return;
  //   if (!Object.is(focusTarget, bodyRef.current)) return;
  //   return;
  //   // Get distance of body to camera.
  //   // const { controls } = cameraActor.getSnapshot()!.context;
  //   // if (!controls) return;
  //   // const distance = controls.radius;
  //   // // If under threshold, set to be invisible.
  //   // const opacity = distance < DIST_TO_CAM_THRESHOLD ? 0 : 1;
  //   // springRef.start({ opacity: opacity });
  //   // lineRef.current.visible =
  //   //   distance < DIST_TO_CAM_THRESHOLD ? false : isVisible;
  // });

  return (
    <>
      <object3D visible={isVisible} ref={objRef}>
        {/** @ts-ignore */}
        <Line ref={lineRef} points={points} color={'white'} lineWidth={2} />
        {/* <mesh material={material} geometry={geometry}> */}
        {/* <meshLineGeometry points={points} /> */}
        {/* <meshLineMaterial
          
            color={'white'}
            sizeAttenuation={0}
            lineWidth={0.01}
          /> */}
        {/* </mesh> */}
        {/* <Segments limit={NUM_OF_POINTS} lineWidth={2}>
          {points.map((point, index, arr) => {
            const i = index + 1 < arr.length ? index + 1 : 0;

            const start: Vector3Tuple = [...point.toArray(), 0];
            const endPoint = arr[i];
            if (!endPoint) return;
            const end: Vector3Tuple = [...endPoint.toArray(), 0];
            return <Segment key={index} start={start} end={end} />;
          })}
        </Segments> */}
        {/* Semi-major Axis / Periapsis */}
        {showPeriapsis && (
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
        )}
      </object3D>
    </>
  );
};
