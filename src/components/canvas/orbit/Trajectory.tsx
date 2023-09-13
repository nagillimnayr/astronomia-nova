/* eslint-disable @typescript-eslint/ban-ts-comment */
import { KeplerBody } from '@/components/canvas/body/kepler-body';
import { DIST_MULT, METER, TWO_PI, X_AXIS } from '@/constants/constants';
import { colorMap } from '@/helpers/color-map';
import { useRootStore } from '@/state/root-store';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { animated } from '@react-spring/three';
import { Line } from '@react-three/drei';
import {
  createPortal,
  extend,
  type MaterialNode,
  type Object3DNode,
  useFrame,
} from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { useSelector } from '@xstate/react';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { type MutableRefObject, useMemo, useRef, useState } from 'react';
import {
  type ArrowHelper,
  type ColorRepresentation,
  EllipseCurve,
  type Object3D,
  Vector3,
} from 'three';
import { type Line2 } from 'three-stdlib';

const _vel = new Vector3();

const DIST_TO_CAM_THRESHOLD = 1e8 * METER;

const NUM_OF_POINTS = 2 ** 14;

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

export type TrajectoryProps = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  periapsis: number;
  linearEccentricity: number;
  bodyRef: MutableRefObject<KeplerBody | null>;
};

/**
 *
 * @param {number} semiMajorAxis
 * @param {number} semiMinorAxis
 * @param {number} linearEccentricity
 * @param {number} periapsis
 * @param {React.MutableRefObject<KeplerBody | null>} bodyRef
 */
export const Trajectory = ({
  semiMajorAxis,
  semiMinorAxis,
  linearEccentricity,
  periapsis,
  bodyRef,
}: TrajectoryProps): JSX.Element => {
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
  // Check if on surface.
  const onSurface = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );
  // Check focus target.
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  // const getThree = useThree(({ get }) => get);
  // const size = useThree(({ size }) => size);

  const isPresenting = useXR(({ isPresenting }) => isPresenting);

  const arrowRef = useRef<ArrowHelper>(null!);
  const objRef = useRef<Object3D>(null!);
  const lineRef = useRef<Line2>(null!);

  const [showPeriapsis, setShowPeriapsis] = useState<boolean>(false);

  // Create points from ellipse.
  const points = useMemo(() => {
    const points = new EllipseCurve(
      -linearEccentricity * METER,
      0,
      semiMajorAxis * METER,
      semiMinorAxis * METER
    ).getSpacedPoints(NUM_OF_POINTS);
    return points.map((vec2) => {
      return new Vector3(vec2.x, 0, -vec2.y);
    });
  }, [semiMajorAxis, semiMinorAxis, linearEccentricity]);

  let isVisible = trajectoryVisibilityOn;
  if (bodyRef.current && focusTarget) {
    if (focusTarget === bodyRef.current && onSurface) {
      isVisible = false;
    }
  }

  /** Disable visibility if too close to camera. */
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

  const trajectoryColor = useRootStore(
    ({ trajectoryColor }) => trajectoryColor
  );
  let color: ColorRepresentation = 'white';
  if (bodyRef.current && trajectoryColor) {
    color = colorMap.get(bodyRef.current.name) ?? 'white';
  }

  const thickness = useRootStore(
    ({ trajectoryThickness }) => trajectoryThickness
  );
  const lineWidth = thickness * (isPresenting ? 0.75 : 1);

  return (
    <>
      <animated.object3D visible={isVisible} ref={objRef}>
        {/** @ts-ignore */}
        <Line
          ref={lineRef}
          points={points}
          color={color}
          lineWidth={lineWidth}
        />
        {/* Semi-major Axis / Periapsis */}
        {showPeriapsis && (
          <arrowHelper
            ref={(arrow) => {
              if (!arrow) return;
              arrowRef.current = arrow;
              arrow.setColor('red');
              arrow.setDirection(X_AXIS);
              arrow.setLength(periapsis / DIST_MULT, 1, 0.25);
            }}
          />
        )}
      </animated.object3D>
    </>
  );
};

/**
 * This line object helps to cover up a lot of the flickering of the trajectory when very close to a planet.
 */
export const PseudoTrajectory = () => {
  const { cameraActor, visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );
  const onSurface = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );
  const trajectories = useSelector(
    visibilityActor,
    ({ context }) => context.trajectories
  );
  const trajectoryVisibilityOn = useSelector(trajectories, (state) =>
    state.matches('active')
  );

  const isPresenting = useXR(({ isPresenting }) => isPresenting);

  const points = useMemo(() => {
    const points: Vector3[] = [];
    for (let i = 0; i < NUM_OF_POINTS + 1; i++) {
      points.push(new Vector3(0, 0, -1 + (i * 2) / NUM_OF_POINTS));
    }
    return points;
  }, []);
  const scale = useMemo(() => {
    return new Vector3(1, 1, 1);
  }, []);

  const lineRef = useRef<Line2>(null!);

  useFrame(() => {
    const body = cameraActor.getSnapshot()!.context.focusTarget;
    if (!(body instanceof KeplerBody)) return;
    if (onSurface) return;

    const line = lineRef.current;
    if (!line) return;

    // Scale the line relative to the circumference of the trajectory, as it
    // must be long enough to cover up the flickering but short enough that the
    // tangent line doesn't stray noticeably off of the curve.
    const distanceToOrigin = body.position.length();
    const circumference = TWO_PI * distanceToOrigin;

    const length = 0.77 * (circumference / 8192);

    _vel.copy(body.velocity);
    body.localToWorld(_vel);
    line.lookAt(_vel);
    // line.scale.set(1, 1, body.meanRadius * 20);
    line.scale.set(1, 1, length);
  });

  const isVisible = trajectoryVisibilityOn && !onSurface;

  const thickness = useRootStore(
    ({ trajectoryThickness }) => trajectoryThickness
  );
  const lineWidth = thickness * (isPresenting ? 0.75 : 1) * 1.1;

  if (!focusTarget) return;
  return createPortal(
    <>
      <Line
        visible={isVisible}
        ref={lineRef}
        points={points}
        lineWidth={lineWidth}
        scale={scale}
        color={'white'}
      />
    </>,
    focusTarget
  );
};
