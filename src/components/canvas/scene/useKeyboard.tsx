import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener } from '@react-hooks-library/core';

export function useKeyboard() {
  const rootActor = MachineContext.useActorRef();
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  useEventListener('keydown', (event) => {
    // console.log(event.code);
    // console.log(event);
    switch (event.code) {
      case 'ArrowLeft': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      case 'Numpad4': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      case 'ArrowRight': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
      case 'Numpad6': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
    }
  });
}
