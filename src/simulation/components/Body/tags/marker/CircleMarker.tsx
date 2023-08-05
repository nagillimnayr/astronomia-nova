import { Billboard, Circle, Html, Ring, useCursor } from '@react-three/drei';
import type KeplerBody from '@/simulation/classes/kepler-body';
import {
  useCallback,
  type MutableRefObject,
  useContext,
  type MouseEventHandler,
  useRef,
  type PropsWithChildren,
  useState,
} from 'react';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import {
  type Mesh,
  type MeshBasicMaterial,
  Vector3,
  DoubleSide,
  PerspectiveCamera,
  type ColorRepresentation,
} from 'three';

import { useActor, useSelector } from '@xstate/react';
import { MachineContext } from '@/state/xstate/MachineProviders';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();

type Props = PropsWithChildren & {
  bodyRef: MutableRefObject<KeplerBody>;
  color: ColorRepresentation;
};
export function CircleMarker({ bodyRef, color }: Props) {
  const { selectionActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Check if marker visibility is on.
  const isVisible = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

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
    // Reduce the opacity when close enough to the camera.
    const body = bodyRef.current;
    if (!isVisible || !body || !circleRef.current) return;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);
    // Rotate to face camera.
    circleRef.current.lookAt(_camWorldPos);

    // Get distance to camera.
    const distance = _bodyWorldPos.distanceTo(_camWorldPos);

    const n = distance / 150;

    const factor = Math.max(1e-5, n);
    // Scale relative to distance from camera.
    circleRef.current.scale.setScalar(factor);
  });

  return (
    <>
      <Circle ref={circleRef} args={[1]} visible={false && isVisible}>
        <meshBasicMaterial
          ref={materialRef}
          side={DoubleSide}
          // opacity={1}
          // transparent
          color={color}
        />
      </Circle>
    </>
  );
}
