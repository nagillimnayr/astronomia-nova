import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener } from '@react-hooks-library/core';

export function useKeyboard() {
  const rootActor = MachineContext.useActorRef();
  const { timeActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  useEventListener('keydown', (event) => {
    console.log(event.code);
    switch (event.code) {
      case 'Space': {
        const { controls } = cameraActor.getSnapshot()!.context;
        console.log(
          `azimuthal angle: ${controls?.azimuthalAngle ?? 'undefined'}`
        );
        break;
      }
      /** Sidereal Day advancement. */
      case 'ArrowUp': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
      case 'Numpad8': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
      case 'ArrowDown': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      case 'Numpad2': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      /** Increment/decrement timescale. */
      case 'ArrowLeft': {
        event.shiftKey
          ? timeActor.send({ type: 'DECREMENT_TIMESCALE_UNIT' })
          : timeActor.send({ type: 'DECREMENT_TIMESCALE' });
        break;
      }
      case 'Numpad4': {
        timeActor.send({ type: 'DECREMENT_TIMESCALE' });
        break;
      }
      case 'ArrowRight': {
        event.shiftKey
          ? timeActor.send({ type: 'INCREMENT_TIMESCALE_UNIT' })
          : timeActor.send({ type: 'INCREMENT_TIMESCALE' });
        break;
      }
      case 'Numpad6': {
        timeActor.send({ type: 'INCREMENT_TIMESCALE' });
        break;
      }
    }
  });
}
