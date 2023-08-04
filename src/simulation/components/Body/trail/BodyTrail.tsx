import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  type Vector3Tuple,
  Event,
  EventListener,
  Float32BufferAttribute,
} from 'three';
import { Trail } from './Trail';
import { Object3DNode, extend } from '@react-three/fiber';
import { MachineContext } from '@/state/xstate/MachineProviders';
import KeplerTreeContext from '@/simulation/context/KeplerTreeContext';
import KeplerBody from '@/simulation/classes/kepler-body';
import { Line } from '@react-three/drei';
import { Line2, LineSegments2 } from 'three-stdlib';
import { flatten } from 'lodash';

extend({ Trail });
declare module '@react-three/fiber' {
  interface ThreeElements {
    trail: Object3DNode<Trail, typeof Trail>;
  }
}

type Props = {
  bodyRef: MutableRefObject<KeplerBody | null>;
  orbitalPeriod: number;
};
export const BodyTrail = ({ bodyRef, orbitalPeriod }: Props) => {
  const timeActor = MachineContext.useSelector(
    ({ context }) => context.timeActor
  );

  const trailRef = useRef<Trail>(null!);

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

  return (
    <>
      <trail
        ref={(trail) => {
          if (!trail) return;
          trailRef.current = trail;
          if (!bodyRef || !bodyRef.current) return;
        }}
        maxLength={orbitalPeriod * 0.95}
        itersPerUpdate={12}
      />
    </>
  );
};
