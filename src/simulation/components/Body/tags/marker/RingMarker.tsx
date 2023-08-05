import { Billboard, Circle, Html, Ring, useCursor } from '@react-three/drei';
import KeplerBody from '@/simulation/classes/kepler-body';
import {
  useCallback,
  type MutableRefObject,
  useContext,
  type MouseEventHandler,
  useRef,
  PropsWithChildren,
  useState,
} from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import {
  Mesh,
  MeshBasicMaterial,
  Vector3,
  DoubleSide,
  PerspectiveCamera,
  FrontSide,
} from 'three';

import { useActor, useSelector } from '@xstate/react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { degToRad } from 'three/src/math/MathUtils';
import { Annotation } from '../annotation/Annotation';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();

const threshold = 0.02;

type Props = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
};
export function RingMarker({ children, bodyRef }: Props) {
  const { selectionActor, visibilityActor, mapActor } =
    MachineContext.useSelector(({ context }) => context);
  const markers = useSelector(
    visibilityActor,
    ({ context }) => context.markers
  );

  const isVisible = useSelector(markers, (state) => state.matches('active'));

  const circleRef = useRef<Mesh>(null!);
  const materialRef = useRef<MeshBasicMaterial>(null!);

  const [isHovered, setHovered] = useState<boolean>(false);
  useCursor(isHovered, 'pointer');

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      const body = bodyRef.current;
      selectionActor.send({ type: 'SELECT', selection: body });
    },
    [bodyRef, selectionActor]
  );

  useFrame(({ camera }) => {
    const body = bodyRef.current;
    if (!body || !circleRef.current) return;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);
    // Rotate to face camera.
    circleRef.current.lookAt(_camWorldPos);

    // Get distance to camera.
    const distanceToCamera = _bodyWorldPos.distanceTo(_camWorldPos);

    // If too close to parent, minimize scale.
    const n = distanceToCamera / 100;

    // Since the local coordinates will have the parent at the origin, we can use the body's local coords to get the distance to the parent.
    const distanceToParent = body.position.length();
    const ratio = distanceToParent / distanceToCamera;

    const factor = ratio > threshold ? Math.max(1e-5, n) : 1e-5;
    // Scale relative to distance from camera.
    const isOrbiter = body.parent instanceof KeplerOrbit;
    circleRef.current.scale.setScalar(isOrbiter ? factor : Math.max(1e-5, n));
  });

  return (
    <>
      <Circle
        ref={circleRef}
        args={[1]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/** Transparent material so that the circle will catch clicks but not be visible. */}
        <meshBasicMaterial side={FrontSide} opacity={0} transparent />
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
}
