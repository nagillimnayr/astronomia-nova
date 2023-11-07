/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { DEV_ENV } from '@/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  type ColorRepresentation,
  type Group,
  type Object3D,
  Vector3,
} from 'three';
import { type Line2 } from 'three-stdlib';

const DELAY = 15;
const _newPos = new Vector3();

const shiftLeft = (collection: Float32Array, steps = 1): Float32Array => {
  collection.set(collection.subarray(steps));
  collection.fill(-Infinity, -steps);
  return collection;
};

const resetTrail = (anchor: Object3D, target: Object3D, length: number) => {
  if (!anchor || !target) {
    return Float32Array.from({ length: length * 10 * 3 }, (_, i) => -Infinity);
  }
  // Get relative position of target.
  target.getWorldPosition(_newPos);
  anchor.worldToLocal(_newPos);
  // Fill array with current position.
  return Float32Array.from({ length: length * 10 * 3 }, (_, i) =>
    _newPos.getComponent(i % 3)
  );
};

type ProjectedTrailProps = {
  body: KeplerBody;
  color?: ColorRepresentation;
  length: number;
};
export const ProjectedTrail = ({
  body,
  color,
  length,
}: ProjectedTrailProps) => {
  const { timeActor, cameraActor, surfaceActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // const onSurface = useSelector(cameraActor, (state) =>
  //   state.matches('surface')
  // );
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));

  const getThree = useThree(({ get }) => get);
  const size = useThree(({ size }) => size);

  const anchorRef = useRef<Group>(null!);
  const lineRef = useRef<Line2>(null!);
  const points = useRef<Float32Array>(null!);

  const reset = useRef<() => void>(null!);
  const setVisibility = useRef<() => void>(null!);

  setVisibility.current = useCallback(() => {
    const line = lineRef.current;
    if (!line) return;
    /* Check if line should be visible. */
    const camState = cameraActor.getSnapshot()!;
    const surface = camState.matches('surface');
    const { focusTarget } = camState.context;
    const isFocused = Object.is(body, focusTarget);
    const paused = timeActor.getSnapshot()!.matches('paused');

    const visible = surface && paused && !isFocused;
    line.visible = visible;

    // console.log(`${line.geometry.name} visible?`, visible);
    // console.log(`onSurface?`, surface);
    // console.log(`camState?`, camState.value);
  }, [body, cameraActor, timeActor]);

  useEffect(() => {
    const anchor = anchorRef.current;
    points.current = resetTrail(anchor, body, length);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, body]);

  /* Store reset callback function in a ref so it can be reused inside of useEffect. */
  reset.current = useCallback(() => {
    const line = lineRef.current;
    if (!line) return;

    /* Position of target won't have updated immediately, 
          so reset the trail after a slight delay. */
    line.visible = false; // Toggle visibility temporarily, to avoid jank.

    /* Reset after slight delay. */
    setTimeout(() => {
      const anchor = anchorRef.current;
      points.current = resetTrail(anchor, body, length);

      /* Check if line should be visible. */
      const camState = cameraActor.getSnapshot()!;

      const { focusTarget } = camState.context;
      const isFocused = Object.is(body, focusTarget);

      setVisibility.current();
      if (isFocused) {
        // console.log(`${line.geometry.name}: `, points.current);
        /* Resetting the trail of the currently focused body causes errors. */
        return;
      }

      // DEV_ENV && console.log(`${line.geometry.name} visible?: `, visible);

      // Update geometry.
      line.geometry.setPositions(points.current);
    }, DELAY);
  }, [body, cameraActor, length]);

  useEffect(() => {
    // Subscribe to surfaceActor, and reset trail whenever coordinates change.
    const subscription = surfaceActor.subscribe((state) => {
      reset.current();
    });
    return () => subscription.unsubscribe();
  }, [surfaceActor]);
  useEffect(() => {
    // Subscribe to timeActor, and reset trail whenever time is unpaused.
    const subscription = timeActor.subscribe((state) => {
      if (state.event.type === 'UNPAUSE') {
        reset.current();
      }
    });
    return () => subscription.unsubscribe();
  }, [length, surfaceActor, timeActor, body]);

  useEffect(() => {
    // Subscribe to cameraActor, and reset trail whenever focus changes.
    const subscription = cameraActor.subscribe((state) => {
      const event = state.event.type;
      if (event !== 'SET_TARGET' && event !== 'AUTO_ANIMATE') return;

      const { focusTarget } = cameraActor.getSnapshot()!.context;
      if (Object.is(body, focusTarget)) {
        /* Hide trail of currently focused body. */
        lineRef.current.visible = false;

        /* Resetting the trail of the focused body causes an error, so skip the reset. */
        return;
      }

      reset.current();
    });

    return () => subscription.unsubscribe();
  }, [body, cameraActor, length]);

  /**  Update points. */
  useEffect(() => {
    const updatePosition = () => {
      const line = lineRef.current;
      if (!line) return;
      const anchor = anchorRef.current;

      // Get relative position of target.
      body.getWorldPosition(_newPos);
      anchor.worldToLocal(_newPos); // Get in local coords.

      // Make room for new position.
      shiftLeft(points.current, 3);
      // Add new position to the end of the array.
      points.current.set(_newPos.toArray(), points.current.length - 3);

      // Update geometry.
      line.geometry.setPositions(points.current);
      line.computeLineDistances();
    };
    const subscription = timeActor.subscribe((state) => {
      if (state.matches('unpaused')) return; // Do nothing if unpaused.
      const onSurface = cameraActor.getSnapshot()!.matches('surface');
      if (!onSurface) return;
      // Only update if the last event was a sidereal advancement of time.
      if (state.event.type !== 'ADVANCE_TIME') return;
      setTimeout(updatePosition, DELAY);
    });

    return () => subscription.unsubscribe();
  }, [timeActor, body, cameraActor]);

  useEffect(() => {
    const { eventManager } = cameraActor.getSnapshot()!.context;

    const enableTrailVisibility = () => {
      const line = lineRef.current;
      if (!line) return;
      const { focusTarget } = cameraActor.getSnapshot()!.context;
      const isFocused = Object.is(body, focusTarget);
      line.visible = !isFocused;
      // DEV_ENV && console.log(`${line.geometry.name} vis: `, line.visible);
    };
    const disableTrailVisibility = () => {
      const line = lineRef.current;
      if (!line) return;
      line.visible = false;
    };

    eventManager.addEventListener('ENTERED_SURFACE', enableTrailVisibility);
    eventManager.addEventListener('EXITED_SURFACE', disableTrailVisibility);
    eventManager.addEventListener(
      'ENABLE_TRAIL_VISIBILITY',
      enableTrailVisibility
    );

    return () => {
      eventManager.removeEventListener(
        'ENTERED_SURFACE',
        enableTrailVisibility
      );
      eventManager.removeEventListener(
        'EXITED_SURFACE',
        disableTrailVisibility
      );
      eventManager.removeEventListener(
        'ENABLE_TRAIL_VISIBILITY',
        enableTrailVisibility
      );
    };
  }, [body, cameraActor, timeActor]);

  const arr = useMemo(() => {
    return [0, 0, 0, 0, 0, 0];
  }, []);

  useEffect(() => {
    /* Set name of geometry, to help with debugging. */
    lineRef.current.geometry.name = `trail-projection-geometry-${body.name}`;
  }, [body.name]);

  return (
    <>
      <group ref={anchorRef} visible={isPaused}>
        <Line
          ref={lineRef}
          points={arr}
          lineWidth={3}
          color={color}
          name="projected-trail"
          dashed={true}
          // dashSize={1e2}
          // dashScale={1e2}
          // gapSize={1e2}
        />
      </group>
    </>
  );
};
