import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  type Vector3Tuple,
  Event,
  EventListener,
  Float32BufferAttribute,
  ColorRepresentation,
  Vector2,
  Mesh,
  Vector3,
} from 'three';
import { Trail } from './Trail';
import { Object3DNode, extend, useFrame, useThree } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import KeplerBody from '@/simulation/classes/kepler-body';

const _bodyWorldPos = new Vector3();
const _camWorldPos = new Vector3();

extend({ Trail });
declare module '@react-three/fiber' {
  interface ThreeElements {
    trail: Object3DNode<Trail, typeof Trail>;
  }
}

type Props = {
  bodyRef: MutableRefObject<KeplerBody | null>;
  orbitalPeriod: number;
  lineWidth?: number;
  color?: ColorRepresentation;
};
export const BodyTrail = ({
  bodyRef,
  orbitalPeriod,
  lineWidth = 1,
  color = 'white',
}: Props) => {
  const timeActor = MachineContext.useSelector(
    ({ context }) => context.timeActor
  );

  const trailRef = useRef<Trail>(null!);
  const meshRef = useRef<Mesh>(null!);

  const getThree = useThree(({ get }) => get);
  const size = getThree().size;

  useEffect(() => {
    if (!trailRef.current) return;
    trailRef.current.setResolution(size.width, size.height);
  }, [size]);

  useEffect(() => {
    if (!bodyRef || !bodyRef.current) return;
    const body = bodyRef.current;

    const listener = () => {
      const trail = trailRef.current;
      if (!trail) return;
      trail.update(body.position.toArray());
    };

    // Update trail whenever body dispatches the 'updated' event.
    body.addEventListener('updated', listener);

    // Cleanup function.
    const cleanup = () => {
      if (!body) return;
      body.removeEventListener('updated', listener);
    };
    return () => cleanup();
  }, [bodyRef]);

  useFrame(({ camera }) => {
    const body = bodyRef.current;
    const trail = trailRef.current;
    if (!body || !trail) return;

    // Get world position of body.
    body.getWorldPosition(_bodyWorldPos);
    // Get world position of camera.
    camera.getWorldPosition(_camWorldPos);
    // Get distance to camera.
    const distanceToCamera = _bodyWorldPos.distanceTo(_camWorldPos);

    // If too close to parent, minimize scale.
    const n = distanceToCamera / 100;

    const factor = Math.max(1e-5, n);
    // Scale relative to distance from camera.
    trail.setLineWidth(factor * lineWidth);
  });

  return (
    <>
      <trail
        ref={trailRef}
        maxLength={orbitalPeriod * 0.95}
        itersPerUpdate={12}
        color={color}
        lineWidth={lineWidth}
      />
    </>
  );
};
