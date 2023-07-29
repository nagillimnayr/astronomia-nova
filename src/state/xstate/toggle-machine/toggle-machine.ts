/* eslint-disable @typescript-eslint/consistent-type-imports */
import { createMachine } from 'xstate';

export const toggleMachine = createMachine({
  tsTypes: {} as import('./toggle-machine.typegen').Typegen0,
  schema: {
    context: {},
    events: {} as { type: 'TOGGLE' },
  },
  id: 'toggle',
  initial: 'active',
  states: {
    active: {
      on: { TOGGLE: 'inactive' },
    },
    inactive: {
      on: { TOGGLE: 'active' },
    },
  },
  predictableActionArguments: true,
});
