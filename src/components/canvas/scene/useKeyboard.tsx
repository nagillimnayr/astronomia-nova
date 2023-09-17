import { MachineContext } from '@/state/xstate/MachineProviders';
import { useEventListener } from '@react-hooks-library/core';

export function useKeyboard() {
  const rootActor = MachineContext.useActorRef();
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  useEventListener('keydown', (event) => {
    console.log(event.code);
    // console.log(event);
    switch (event.code) {
      case 'ArrowUp': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      case 'Numpad8': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: true });
        break;
      }
      case 'ArrowDown': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
      case 'Numpad2': {
        rootActor.send({ type: 'ADVANCE_DAY', reverse: false });
        break;
      }
      case 'KeyU': {
        timeActor.send({ type: 'INCREMENT_TIMESCALE_UNIT' });
        break;
      }
    }
  });
}
