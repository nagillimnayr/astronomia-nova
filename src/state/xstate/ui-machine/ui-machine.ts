import { assign, createMachine, log } from 'xstate';
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

export const uiMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./ui-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'ui',
    // Initial context.
    context: () => ({
      screenPortalRef: null!,
      camViewPortalRef: null!,
    }),
    // Context assignment events.
    on: {
      ASSIGN_SCREEN_PORTAL_REF: {
        actions: ['assignScreenPortalRef', log('Assigning screen portal ref')],
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
          log('Assigning cam view portal ref'),
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
