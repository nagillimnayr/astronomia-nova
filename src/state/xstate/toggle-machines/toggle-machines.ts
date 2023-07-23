import { createMachine, interpret } from 'xstate';
import { createActorContext } from '@xstate/react';

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
export const TrajectoryVisMachineContext =
  createActorContext(trajectoryVisMachine);

export const annotationVisMachine = createMachine(toggleMachine);
export const AnnotationVisMachineContext =
  createActorContext(annotationVisMachine);

export const markerVisMachine = createMachine(toggleMachine);
export const MarkerVisMachineContext = createActorContext(markerVisMachine);
