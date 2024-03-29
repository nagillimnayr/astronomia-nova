import { makeFixedUpdateFn } from '@/helpers/fixed-time-step';
import { getGamepads, getXRButtons } from '@/helpers/xr/pollXRInputSources';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useFrame, useThree } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import { useMemo, useRef } from 'react';

export function useVRButtonControls() {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  const getThree = useThree(({ get }) => get);
  const getXR = useXR(({ get }) => get);

  const pollXRButtons = useRef<(deltaTime: number) => void>(null!);
  pollXRButtons.current = useMemo(() => {
    const pollXRButtons = makeFixedUpdateFn((deltaTime: number) => {
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
          // console.log('button X');
          if (!onSurface) return;
          rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        }

        if (buttonY && buttonY.pressed) {
          // console.log('button Y');
        }
      }

      // Poll right gamepad.
      if (rightGamepad) {
        const [buttonA, buttonB] = getXRButtons(rightGamepad);
        if (buttonA && buttonA.pressed) {
          // console.log('button A');
          if (!onSurface) return;
          rootActor.send({ type: 'ADVANCE_DAY' });
        }

        if (buttonB && buttonB.pressed) {
          // console.log('button B');
        }
      }
    }, 10);
    return pollXRButtons;
  }, [cameraActor, getThree, rootActor]);

  useFrame((_, delta) => {
    if (!getXR().isPresenting) return;
    pollXRButtons.current(delta);
  });
}
