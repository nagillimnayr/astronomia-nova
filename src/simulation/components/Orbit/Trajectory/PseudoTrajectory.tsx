import KeplerBody from '@/simulation/classes/kepler-body';
import { TWO_PI } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Line } from '@react-three/drei';
import { createPortal, useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { distance } from 'mathjs';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { Line2 } from 'three-stdlib';

const _vel = new Vector3();
const NUM_OF_SEGMENTS = 1024;

// This line helps to cover up a lot of the flickering of the trajectory when very close to a planet.
export const PseudoTrajectory = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );
  const onSurface = useSelector(cameraActor, (state) =>
    state.matches('surface')
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

  const lineRef = useRef<Line2>(null!);

  useFrame(() => {
    const body = cameraActor.getSnapshot()!.context.focusTarget;
    if (!(body instanceof KeplerBody)) return;
    if (onSurface) return;

    const line = lineRef.current;
    if (!line) return;

    // Scale the line relative to the circumference of the trajectory, as it must be long enough to cover up the flickering but short enough that the tangent line doesn't stray notiveably off of the curve.
    const distanceToOrigin = body.position.length();
    const circumference = TWO_PI * distanceToOrigin;
    const length = circumference / 4096;

    _vel.copy(body.velocity);
    body.localToWorld(_vel);
    line.lookAt(_vel);
    // line.scale.set(1, 1, body.meanRadius * 20);
    line.scale.set(1, 1, length);
  });

  if (!focusTarget) return;
  return createPortal(
    <>
      <Line
        visible={!onSurface}
        ref={lineRef}
        points={points}
        lineWidth={2.1}
        scale={scale}
        color={'white'}
      />
    </>,
    focusTarget
  );
};
