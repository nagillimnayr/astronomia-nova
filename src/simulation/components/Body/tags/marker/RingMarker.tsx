/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Billboard,
  Circle,
  Html,
  MeshDiscardMaterial,
  Ring,
  Sphere,
  useCursor,
  useHelper,
} from '@react-three/drei';
import KeplerBody from '@/simulation/classes/kepler-body';
import {
  useCallback,
  type MutableRefObject,
  useContext,
  type MouseEventHandler,
  useRef,
  PropsWithChildren,
  useState,
  forwardRef,
  useMemo,
} from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import {
  Mesh,
  MeshBasicMaterial,
  Vector3,
  DoubleSide,
  PerspectiveCamera,
  FrontSide,
  BoxHelper,
} from 'three';

import { useActor, useSelector } from '@xstate/react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { degToRad } from 'three/src/math/MathUtils';
import { Annotation } from '../annotation/Annotation';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import { Interactive } from '@react-three/xr';
import { animated, useSpring } from '@react-spring/three';

type MarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
};
export const RingMarker = forwardRef<Mesh, MarkerProps>(function RingMarker(
  { children, bodyRef }: MarkerProps,
  fwdRef
) {
  const { visibilityActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const markers = useSelector(
    visibilityActor,
    ({ context }) => context.markers
  );
  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  const isVisible =
    useSelector(markers, (state) => state.matches('active')) &&
    Boolean(selected) &&
    Object.is(bodyRef.current, selected);

  const spring = useSpring({ opacity: isVisible ? 1 : 0 });
  const ringArgs: [number, number, number] = useMemo(() => {
    const outerRadius = 1;
    const innerRadius = 0.9;
    const segments = 32;
    return [innerRadius, outerRadius, segments];
  }, []);

  return (
    <>
      <Ring ref={fwdRef} visible={isVisible} args={ringArgs} scale={1.35}>
        {/** @ts-ignore */}
        <animated.meshBasicMaterial
          color={'white'}
          side={FrontSide}
          transparent={true}
          opacity={spring.opacity}
        />
        {/* <axesHelper args={[radius * 2]} /> */}
        {children}
      </Ring>
    </>
  );
});
