import { createMachine, interpret } from 'xstate';

const viewModeMachine = createMachine({
  initial: 'space',
  states: {
    space: {
      on: {
        TO_SURFACE: 'surface',
      },
    },
    surface: {
      on: { TO_SPACE: 'space' },
    },
  },
});
