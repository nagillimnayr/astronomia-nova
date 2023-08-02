/* eslint-disable @typescript-eslint/consistent-type-imports */
import { createMachine } from 'xstate';

type Context = {};

type Events = { type: 'TOGGLE' } | { type: 'ENABLE' } | { type: 'DISABLE' };

export const toggleMachine = createMachine({
  tsTypes: {} as import('./toggle-machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'toggle',
  initial: 'active',
  states: {
    active: {
      on: { TOGGLE: 'inactive', DISABLE: 'inactive' },
    },
    inactive: {
      on: { TOGGLE: 'active', ENABLE: 'active' },
    },
  },
  predictableActionArguments: true,
});
