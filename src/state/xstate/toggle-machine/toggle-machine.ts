/* eslint-disable @typescript-eslint/consistent-type-imports */
import { createMachine, log } from 'xstate';

type Context = {};

type Events = { type: 'TOGGLE' } | { type: 'ENABLE' } | { type: 'DISABLE' };

export const toggleMachine = createMachine({
  predictableActionArguments: true,
  tsTypes: {} as import('./toggle-machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'toggle',

  initial: 'active',
  states: {
    active: {
      on: {
        TOGGLE: {
          target: 'inactive',
        },
        DISABLE: {
          target: 'inactive',
        },
      },
    },
    inactive: {
      on: {
        TOGGLE: {
          target: 'active',
        },
        ENABLE: {
          target: 'active',
        },
      },
    },
  },
});
