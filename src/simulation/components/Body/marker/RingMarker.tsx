import { Billboard, Circle, Html, Ring, useCursor } from '@react-three/drei';
import type KeplerBody from '@/simulation/classes/kepler-body';
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
} from 'three';

import { useActor, useSelector } from '@xstate/react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { DIST_MULT, EARTH_RADIUS } from '@/simulation/utils/constants';
import { degToRad } from 'three/src/math/MathUtils';
import { Annotation } from '../annotation/Annotation';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();
const _camPos = new Vector3();

type Props = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
};
export function RingMarker({ children, bodyRef }: Props) {
  const { selectionService, visibilityService } =
    useContext(GlobalStateContext);
  const markers = useSelector(
    visibilityService,
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
      selectionService.send({ type: 'SELECT', selection: body });
    },
    [bodyRef, selectionService]
  );

  useFrame(({ camera }) => {
    // Reduce the opacity when close enough to the camera.

    if (!bodyRef.current || !circleRef.current) return;

    const body = bodyRef.current;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);
    // Rotate to face camera.
    circleRef.current.lookAt(_camWorldPos);

    // Get distance to camera.
    const sqDistance = _bodyWorldPos.distanceToSquared(_camWorldPos);
    const distance = _bodyWorldPos.distanceTo(_camWorldPos);

    const n = distance / 100;

    const factor = Math.max(1e-5, n);
    // Scale relative to distance from camera.
    circleRef.current.scale.setScalar(factor);

    const opacity = Math.min(sqDistance / 1e2, 1);
    materialRef.current.opacity = opacity ** 2;
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
        <meshBasicMaterial side={DoubleSide} opacity={0} transparent />
        <Ring visible={isVisible} args={[1, 1.25]}>
          <meshBasicMaterial
            ref={materialRef}
            color={'white'}
            side={DoubleSide}
            transparent
          />
          {/* <axesHelper args={[radius * 2]} /> */}
          {children}
        </Ring>
      </Circle>
    </>
  );
}
