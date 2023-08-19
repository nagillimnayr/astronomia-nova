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

  const sphereRef = useRef<Mesh>(null!);
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
    if (!body || !sphereRef.current) return;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);
    // Rotate to face camera.
    sphereRef.current.lookAt(_camWorldPos);

    // Get distance to camera.
    const distanceToCamera = _bodyWorldPos.distanceTo(_camWorldPos);

    // If too close to parent, minimize scale.
    const n = distanceToCamera / 100;

    const factor = Math.max(1e-5, n);
    // Scale relative to distance from camera.
    sphereRef.current.scale.setScalar(factor);
  });

  // const boxHelper = useHelper(sphereRef, BoxHelper);

  return (
    <>
      <Sphere
        ref={sphereRef}
        args={[2]}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          console.log('pointer enter over sphere');
        }}
        onPointerLeave={() => {
          setHovered(false);

          console.log('pointer leave sphere');
        }}
      >
        {/** Transparent material so that the circle will catch clicks but not be visible. */}
        <MeshDiscardMaterial />
        {/* <meshBasicMaterial side={DoubleSide} opacity={1} transparent /> */}
        <Ring visible={isVisible} args={[1, 1.25]} onClick={handleClick}>
          <meshBasicMaterial
            ref={materialRef}
            color={'white'}
            side={FrontSide}
          />
          {/* <axesHelper args={[radius * 2]} /> */}
          {children}
        </Ring>
      </Sphere>
    </>
  );
}
