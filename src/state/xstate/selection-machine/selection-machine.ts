import type KeplerBody from '@/simulation/classes/kepler-body';
import { assign, createMachine } from 'xstate';

type Context = {
  selected: KeplerBody | null;
};

type Events = { type: 'SELECT'; selection: KeplerBody } | { type: 'DESELECT' };

export const selectionMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./selection-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'selection',
    // Initial context:
    context: () => ({
      selected: null,
    }),

    // Context assignment events:
    on: {
      SELECT: {
        actions: 'select',
      },
      DESELECT: {
        actions: 'deselect',
      },
    },

    initial: 'idle',
    states: {
      idle: {},
    },
  },
  {
    actions: {
      select: assign({ selected: (_, event) => event.selection }),
      deselect: assign({ selected: () => null }),
    },
  }
);
