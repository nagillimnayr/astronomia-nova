import type KeplerBody from '@/components/canvas/body/kepler-body';
import { assign, createMachine } from 'xstate';

type Context = {
  selected: KeplerBody | null;
};

type Events = { type: 'SELECT'; selection: KeplerBody } | { type: 'DESELECT' };

export const selectionMachine = createMachine({
  predictableActionArguments: true,
  tsTypes: {} as import('./selection-machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'selection-machine',
  // Initial context:
  context: () => ({
    selected: null,
  }),

  // Context assignment events:
  on: {
    SELECT: {
      cond: (context, event) => {
        return context.selected !== event.selection;
      },
      actions: [
        assign({ selected: (_, event) => event.selection }),
        (context) => {
          console.log('new selection:', context.selected);
        },
      ],
    },
    DESELECT: {
      actions: [
        assign({ selected: () => null }),
        (context) => {
          console.log('deselect!:', context.selected);
        },
      ],
    },
  },

  initial: 'idle',
  states: {
    idle: {},
  },
});
