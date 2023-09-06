import { getGamepads, getXRButtons } from '@/lib/xr/pollXRInputSources';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useInterval } from '@react-hooks-library/core';
import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';

export function useVRButtonControls() {
  const rootActor = MachineContext.useActorRef();
  const { vrActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // const session = useXR(({ session }) => session);

  // const getXR = useXR(({ get }) => get);
  const getThree = useThree(({ get }) => get);

  const pollXRButtons = useCallback(() => {
    // cameraActor.send({ type: 'POLL_XR_BUTTONS' });
    // console.log('poll XR Buttons');
    const { gl } = getThree();
    const { xr } = gl;
    if (!xr.enabled || !xr.isPresenting) return;
    const session = xr.getSession();
    if (!session) return;
    const onSurface = cameraActor.getSnapshot()!.matches('surface');

    const { leftGamepad, rightGamepad } = getGamepads(session);
    // console.log('left gamepad:', leftGamepad);
    // console.log('right gamepad:', rightGamepad);

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

        // const vrHud = cameraActor.getSnapshot()!.context.vrHud;

        // // Move vrHud back.
        // if (!vrHud) return;
        // vrHud.translateZ(-0.1);
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
  }, [cameraActor, getThree, rootActor]);
  useInterval(pollXRButtons, 100); // Poll buttons every 0.25 seconds.
}
