import { createMachine, interpret } from 'xstate';

const toggleMachine = {
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
};

export const trajectoryVisMachine = createMachine(toggleMachine);
export const annotationVisMachine = createMachine(toggleMachine);
export const markerVisMachine = createMachine(toggleMachine);
