import KeplerBody from '@/simulation/classes/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Line } from '@react-three/drei';
import { createPortal, useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { Line2 } from 'three-stdlib';

const _vel = new Vector3();
const LENGTH = 1e9;
const NUM_OF_SEGMENTS = 1024;

export const PseudoTrajectory = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const points = useMemo(() => {
    const points: Vector3[] = [];
    for (let i = 0; i < NUM_OF_SEGMENTS + 1; i++) {
      points.push(new Vector3(0, 0, -1 + (i * 2) / NUM_OF_SEGMENTS));
    }
    return points;
  }, []);
  const scale = useMemo(() => {
    return new Vector3(1, 1, 1);
  }, []);
  scale.set(1, 1, LENGTH);

  const lineRef = useRef<Line2>(null!);

  useFrame(() => {
    const body = cameraActor.getSnapshot()!.context.focusTarget;
    if (!(body instanceof KeplerBody)) return;
    const line = lineRef.current;
    if (!line) return;

    _vel.copy(body.velocity);
    body.localToWorld(_vel);
    line.lookAt(_vel);
  });

  if (!focusTarget) return;
  return createPortal(
    <>
      <Line
        ref={lineRef}
        points={points}
        lineWidth={2}
        scale={scale}
        color={'white'}
      />
    </>,
    focusTarget
  );
};
