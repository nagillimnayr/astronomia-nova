import { createMachine } from 'xstate';
type Context = {
  screenPortal: HTMLElement;
};

type Events =
  | { type: 'ASSIGN_SCREEN_PORTAL'; screenPortal: HTMLElement }
  | { type: 'TOGGLE' };

const toggleStates = {
  initial: 'active',
  states: {
    active: {
      on: { TOGGLE: 'inactive' },
    },
    inactive: {
      on: { TOGGLE: 'active' },
    },
  },
};

export const uiMachine = createMachine(
  {
    predictableActionArguments: true,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },

    context: () => ({
      screenPortal: null!,
    }),
    // Context assignment events.
    on: {
      ASSIGN_SCREEN_PORTAL: {
        actions: 'assignScreenPortal',
      },
    },

    type: 'parallel',
    // Parallel states:
    states: {
      outliner: {
        ...toggleStates,
      },
    },
  },
  {
    actions: {},
  }
);
