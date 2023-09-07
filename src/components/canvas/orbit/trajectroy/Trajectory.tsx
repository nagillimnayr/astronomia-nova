/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Line} from '@react-three/drei';
import {MeshLineGeometry, MeshLineMaterial} from 'meshline';
import {type MutableRefObject, useEffect, useMemo, useRef, useState,} from 'react';
import {type ArrowHelper, type ColorRepresentation, EllipseCurve, type Object3D, Vector3,} from 'three';
import {useSelector} from '@xstate/react';
import {MachineContext} from '@/state/xstate/MachineProviders';
import {DIST_MULT, METER, X_AXIS} from '@/constants/constants';
import type KeplerBody from '@/components/canvas/body/kepler-body';
import {extend, type MaterialNode, type Object3DNode,} from '@react-three/fiber';
import {animated, useSpring} from '@react-spring/three';
import {type Line2} from 'three-stdlib';
import {useXR} from '@react-three/xr';
import {useRootStore} from '@/state/root-store';
import {colorMap} from '@/helpers/color-map';

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

  const [spring, springRef] = useSpring(() => ({
    scale: 1,
    // onChange: (result) => {
    //   if (typeof result.value.opacity !== 'number') {
    //     console.log('not number', result);
    //     return;
    //   }
    //   const line = lineRef.current;
    //   if (!line) return;
    //   line.material.opacity = result.value.opacity;
    // },
    // Opacity for the line doesn't completely work and will leave black artifacts, so set the visibility to false once the animation has completed.
    // onRest: (result, ctrl, item) => {
    //   // console.log('onRest:', result);
    //   if (typeof result.value.scale !== 'number') {
    //     console.log('not number', result);
    //     return;
    //   }

    //   // const opacity = result.value.opacity;
    //   const line = lineRef.current;
    //   // line.visible = opacity > Number.EPSILON;
    // },
    // onStart: (result) => {
    //   // console.log('onStart:', result);
    //   if (typeof result.value.opacity !== 'number') {
    //     console.log('not number', result);
    //     return;
    //   }
    //   const line = lineRef.current;
    //   line.visible = true;
    // },
  }));

  useEffect(() => {
    springRef.start({ scale: isVisible ? 1 : 0 });
  }, [isVisible, springRef]);

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
      <animated.object3D
        visible={isVisible}
        ref={objRef}
        // scale={spring.scale}
      >
        {/** @ts-ignore */}
        <Line
          ref={lineRef}
          points={points}
          color={color}
          lineWidth={lineWidth}
          // transparent
        />
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
      </animated.object3D>
    </>
  );
};
