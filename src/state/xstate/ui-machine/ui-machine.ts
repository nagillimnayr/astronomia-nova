import { assign, createMachine } from 'xstate';
import { type MutableRefObject } from 'react';

type Context = {
  screenPortalRef: MutableRefObject<HTMLDivElement>;
  camViewPortalRef: MutableRefObject<HTMLDivElement>;
};

type Events =
  | { type: 'TOGGLE' }
  | {
      type: 'ASSIGN_SCREEN_PORTAL_REF';
      screenPortalRef: MutableRefObject<HTMLDivElement>;
    }
  | { type: 'SET_SCREEN_PORTAL'; screenPortal: HTMLDivElement }
  | {
      type: 'ASSIGN_CAM_VIEW_PORTAL_REF';
      camViewPortalRef: MutableRefObject<HTMLDivElement>;
    }
  | { type: 'SET_CAM_VIEW_PORTAL'; camViewPortal: HTMLDivElement };

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
      ASSIGN_SCREEN_PORTAL_REF: {
        actions: [
          'assignScreenPortalRef',
          () => console.log('Assigning screen portal ref'),
        ],
      },
      SET_SCREEN_PORTAL: {
        actions: [
          (context, event) => {
            context.screenPortalRef.current = event.screenPortal;
          },
        ],
      },
      ASSIGN_CAM_VIEW_PORTAL_REF: {
        actions: [
          'assignCamViewPortalRef',
          () => console.log('Assigning cam view portal ref'),
        ],
      },
      SET_CAM_VIEW_PORTAL: {
        actions: [
          (context, event) => {
            context.camViewPortalRef.current = event.camViewPortal;
          },
        ],
      },
    },

    type: 'parallel',
    // Parallel states:
    states: {
      idle: {},
      camView: {
        initial: 'pending',
        states: {
          pending: {
            on: {
              SET_CAM_VIEW_PORTAL: { target: 'assigned' },
            },
          },
          assigned: {},
        },
      },
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
