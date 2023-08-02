import { assign, createMachine, log } from 'xstate';
import { cameraMachine } from '../camera-machine/camera-machine';
import { selectionMachine } from '../selection-machine/selection-machine';

type Context = {};

type Events = { type: 'UPDATE'; deltaTime: number };

export const rootMachine = createMachine({
  predictableActionArguments: true,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'root-machine',
  context: () => ({}),

  // Child machines.
  invoke: [
    {
      id: 'camera-machine',
      src: cameraMachine,
    },
    {
      id: 'selection-machine',
      src: selectionMachine,
    },
  ],
});
