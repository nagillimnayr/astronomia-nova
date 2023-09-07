import { getGamepads, getXRButtons } from '@/lib/xr/pollXRInputSources';
import { makeFixedUpdateFn } from '@/simulation/systems/FixedTimeStep';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useInterval } from '@react-hooks-library/core';
import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';

export function useVRButtonControls() {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  const getThree = useThree(({ get }) => get);

  const remainder = useRef<number>(0);

  const pollXRButtons = useRef<(deltaTime: number) => void>(null!);
  pollXRButtons.current = useMemo(() => {
    const pollXRButtons = makeFixedUpdateFn((deltaTime: number) => {
      console.log('deltaTime:', deltaTime);
      const { gl } = getThree();
      const { xr } = gl;
      if (!xr.isPresenting) return;
      const session = xr.getSession();
      if (!session) return;
      const onSurface = cameraActor.getSnapshot()!.matches('surface');

      const { leftGamepad, rightGamepad } = getGamepads(session);

      // Poll left gamepad.
      if (leftGamepad) {
        const [buttonX, buttonY] = getXRButtons(leftGamepad);
        if (buttonX && buttonX.pressed) {
          console.log('button X');
          if (!onSurface) return;
          rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        }

        if (buttonY && buttonY.pressed) {
          console.log('button Y');
        }
      }

      // Poll right gamepad.
      if (rightGamepad) {
        const [buttonA, buttonB] = getXRButtons(rightGamepad);
        if (buttonA && buttonA.pressed) {
          console.log('button A');
          if (!onSurface) return;
          rootActor.send({ type: 'ADVANCE_DAY' });
        }

        if (buttonB && buttonB.pressed) {
          console.log('button B');
        }
      }
    }, 30);
    return pollXRButtons;
  }, [cameraActor, getThree, rootActor]);
  // useInterval(pollXRButtons, 100); // Poll buttons on interval.

  useFrame((state, delta, frame) => {
    if (!(frame instanceof XRFrame)) return;
    pollXRButtons.current(delta);
  });
}
