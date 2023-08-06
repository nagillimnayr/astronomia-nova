import { createMachine } from 'xstate';

type Context = {};

type Events = { type: 'TOGGLE' } | { type: 'OPEN' } | { type: 'CLOSE' };

const outlinerItemMachine = createMachine({
  predictableActionArguments: true,
  tsTypes: {} as import('./outliner-item-machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },

  id: 'outliner-item-machine',
  initial: 'opening',
  states: {
    opening: {
      invoke: {
        src: 'openSubtree',
      },
    },
    open: {
      on: {
        TOGGLE: {
          target: 'closing',
        },
        CLOSE: {
          target: 'closing',
        },
      },
    },
    closing: {
      invoke: {
        src: 'closeSubtree',
      },
    },
    closed: {
      on: {
        TOGGLE: {
          target: 'opening',
        },
        OPEN: {
          target: 'opening',
        },
      },
    },
  },
});
