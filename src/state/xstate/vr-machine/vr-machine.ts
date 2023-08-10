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
        actions: ['logEvent', 'assignPlayer', 'initializePlayer'],
      },
      ASSIGN_LEFT_CONTROLLER: {
        cond: (context, event) => {
          return context.leftController !== event.controller;
        },
        actions: ['logEvent', 'assignLeftController', 'initializeController'],
      },
      ASSIGN_RIGHT_CONTROLLER: {
        cond: (context, event) => {
          return context.rightController !== event.controller;
        },
        actions: ['logEvent', 'assignRightController', 'initializeController'],
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
        console.log('session input sources:', session.inputSources);
        session.addEventListener('select', (event) => console.log(event));
        session.addEventListener('selectstart', (event) => console.log(event));
        session.addEventListener('selectend', (event) => console.log(event));
        try {
          console.log('Initializing XRSession!');
          console.log('near:', session.renderState.depthNear);
          console.log('far:', session.renderState.depthFar);
          // Initialize the near and far clip planes.
          void session.updateRenderState({
            depthNear: NEAR,
            depthFar: FAR,
          });
        } catch (err) {
          console.error('Error! failed to init XR session render state:', err);
        }
      },
      initializePlayer: ({ player }) => {
        if (!player) return;
        // Set starting position.
        // player.position.set(0, 0, 750);
      },
      initializeController: ({ session }, { controller }) => {
        if (!session) return;
        const inputSource = controller.inputSource;

        const profiles = inputSource.profiles;
        console.log('handedness', inputSource.handedness);
        console.log('profiles:', profiles);
        const gamepad = inputSource.gamepad;
        if (!gamepad) return;
        console.log('gamepad:', gamepad);
        console.log('gamepad connected?:', gamepad.connected);
        controller.addEventListener('connected', (event) => {
          console.log(`controller connected!`, event);
        });
        if ('gamepad' in gamepad) {
          console.log('gamepad.gamepad', gamepad.gamepad);
        }
      },
    },
  }
);
