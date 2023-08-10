import { FAR, NEAR } from '@/components/canvas/scene-constants';
import { type XRController } from '@react-three/xr';
import { type Group } from 'three';
import { assign, createMachine, log } from 'xstate';

type Context = {
  session: XRSession | null;
  player: Group | null;
  leftController: XRController | null;
  rightController: XRController | null;
};

type Events =
  | { type: 'START_SESSION'; session: XRSession }
  | { type: 'END_SESSION' }
  | { type: 'ASSIGN_PLAYER'; player: Group }
  | { type: 'ASSIGN_LEFT_CONTROLLER'; controller: XRController }
  | { type: 'ASSIGN_RIGHT_CONTROLLER'; controller: XRController };

export const vrMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./vr-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'vr-machine',
    context: {
      session: null,
      player: null,
      leftController: null,
      rightController: null,
    },

    on: {
      ASSIGN_PLAYER: {
        cond: (context, event) => {
          return context.player !== event.player;
        },
        actions: ['logEvent', 'assignPlayer'],
      },
      ASSIGN_LEFT_CONTROLLER: {
        cond: (context, event) => {
          return context.leftController !== event.controller;
        },
        actions: ['logEvent', 'assignLeftController'],
      },
      ASSIGN_RIGHT_CONTROLLER: {
        cond: (context, event) => {
          return context.rightController !== event.controller;
        },
        actions: ['logEvent', 'assignRightController'],
      },
    },

    initial: 'stopped',
    states: {
      stopped: {
        on: {
          START_SESSION: {
            cond: (context, event) => context.session !== event.session,
            actions: ['logEvent', 'assignSession', 'initializeSession'],
            target: 'started',
          },
        },
      },
      started: {
        on: {
          END_SESSION: {
            actions: ['logEvent'],
            target: 'stopped',
          },
        },
      },
    },
  },

  {
    actions: {
      // Context assignments:
      assignSession: assign({
        session: (_, { session }) => session,
      }),
      assignPlayer: assign({
        player: (_, { player }) => player,
      }),
      assignLeftController: assign({
        leftController: (_, { controller }) => controller,
      }),
      assignRightController: assign({
        rightController: (_, { controller }) => controller,
      }),

      // Other actions:
      logEvent: log((_, event) => event),
      initializeSession: (context, event) => {
        const { session } = context;
        if (!session) throw new Error('Error! XRSession is null');

        try {
          // Initialize the near and far clip planes.
          void session.updateRenderState({
            depthNear: NEAR,
            depthFar: FAR,
          });
        } catch (err) {
          console.error('Error! failed to init XR session render state:', err);
        }
      },
    },
  }
);
