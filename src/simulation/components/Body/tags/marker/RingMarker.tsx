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

type MarkerProps = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
};
export const RingMarker = forwardRef<Mesh, MarkerProps>(function RingMarker(
  { children, bodyRef }: MarkerProps,
  fwdRef
) {
  const { visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const markers = useSelector(
    visibilityActor,
    ({ context }) => context.markers
  );

  const isVisible = useSelector(markers, (state) => state.matches('active'));

  const materialRef = useRef<MeshBasicMaterial>(null!);

  return (
    <>
      <Circle visible={isVisible} ref={fwdRef} args={[1.25]}>
        <MeshDiscardMaterial />
        {/* <meshBasicMaterial side={DoubleSide} opacity={1} transparent /> */}
        <Ring visible={isVisible} args={[1, 1.25]}>
          <meshBasicMaterial
            ref={materialRef}
            color={'white'}
            side={FrontSide}
          />
          {/* <axesHelper args={[radius * 2]} /> */}
          {children}
        </Ring>
      </Circle>
    </>
  );
});
