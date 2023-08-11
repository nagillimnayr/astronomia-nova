import { FAR, NEAR } from '@/components/canvas/scene-constants';
import { VRCameraController } from '@/components/canvas/vr/classes/VRCameraController';
import { type XRController } from '@react-three/xr';
import { Object3D, type Group, Vector3 } from 'three';
import { assign, createMachine, log } from 'xstate';
import { degToRad } from 'three/src/math/MathUtils';

type Context = {
  session: XRSession | null;
  player: Group | null;
  leftController: XRController | null;
  rightController: XRController | null;
  vrCameraController: VRCameraController;
};

type Events =
  | { type: 'START_SESSION'; session: XRSession }
  | { type: 'END_SESSION' }
  | { type: 'ASSIGN_PLAYER'; player: Group }
  | { type: 'ASSIGN_LEFT_CONTROLLER'; controller: XRController }
  | { type: 'ASSIGN_RIGHT_CONTROLLER'; controller: XRController }
  | { type: 'UPDATE'; deltaTime: number };

export const vrMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./vr-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'vr-machine',
    context: () => ({
      session: null,
      player: null,
      leftController: null,
      rightController: null,
      vrCameraController: null!,
    }),

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
          UPDATE: {
            cond: ({ session, player }) => !!(session && player),
            actions: ['update'],
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
        vrCameraController: (_, { player }) => new VRCameraController(player),
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
      initializePlayer: ({ player, vrCameraController }) => {
        if (!player) return;
      },
      initializeController: ({ session }, { controller }) => {
        if (!session) return;
        const inputSource = controller.inputSource;
        const gamepad = inputSource.gamepad;
      },
      update: (
        { session, vrCameraController, rightController, leftController },
        { deltaTime }
      ) => {
        if (!vrCameraController) {
          console.error('Error! vrCameraController is invalid');
          return;
        }
        if (!rightController) return;
        const rightGamepad = rightController.inputSource.gamepad;
        if (!rightGamepad) return;

        const rightAxes = rightGamepad.axes;
        const yaw = rightAxes[2];
        const pitch = rightAxes[3];
        if (yaw) {
          vrCameraController.addYaw(yaw);
        }
        if (pitch) {
          vrCameraController.addPitch(pitch);
        }

        if (!leftController) return;
        const leftGamepad = leftController.inputSource.gamepad;
        if (!leftGamepad) return;
        const leftAxes = leftGamepad.axes;

        const zoom = leftAxes[3];
        if (zoom) {
          vrCameraController.zoom(zoom);
        }

        vrCameraController.update(deltaTime);
      },
    },
  }
);
