import { assign, createMachine } from 'xstate';
import { type MutableRefObject } from 'react';

type Context = {
  screenPortalRef: MutableRefObject<HTMLElement>;
  camViewPortalRef: MutableRefObject<HTMLElement>;
};

type Events =
  | { type: 'TOGGLE' }
  | {
      type: 'ASSIGN_SCREEN_PORTAL';
      screenPortalRef: MutableRefObject<HTMLElement>;
    }
  | {
      type: 'ASSIGN_CAM_VIEW_PORTAL';
      camViewPortalRef: MutableRefObject<HTMLElement>;
    };

// Reusable sub-state.
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
    tsTypes: {} as import('./ui-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },

    // Initial context.
    context: () => ({
      screenPortalRef: null!,
      camViewPortalRef: null!,
    }),
    // Context assignment events.
    on: {
      ASSIGN_SCREEN_PORTAL: {
        actions: 'assignScreenPortalRef',
      },
      ASSIGN_CAM_VIEW_PORTAL: {
        actions: 'assignCamViewPortalRef',
      },
    },

    type: 'parallel',
    // Parallel states:
    states: {
      idle: {},
      // outliner: {
      //   ...toggleStates,
      // },
    },
  },
  {
    actions: {
      assignScreenPortalRef: assign({
        screenPortalRef: (_, event) => event.screenPortalRef,
      }),
      assignCamViewPortalRef: assign({
        camViewPortalRef: (_, event) => event.camViewPortalRef,
      }),
    },
  }
);
