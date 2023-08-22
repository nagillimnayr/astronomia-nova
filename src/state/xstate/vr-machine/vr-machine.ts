import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { type RootState } from '@react-three/fiber';
import { type XRState, type XRController } from '@react-three/xr';
import { Object3D, type Group, Vector3, type WebXRManager } from 'three';
import { assign, createMachine, log } from 'xstate';

type Context = {
  getThree: () => RootState;
  getXR: () => XRState;
  xr: WebXRManager | null;
  refSpaceOrigin: XRReferenceSpace | null;
  session: XRSession | null;
  player: Group | null;
  leftController: XRController | null;
  rightController: XRController | null;
  pose: XRViewerPose | null;
};

type Events =
  | { type: 'START_SESSION'; session: XRSession }
  | { type: 'END_SESSION' }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  | { type: 'ASSIGN_GET_XR'; getXR: () => XRState }
  | { type: 'ASSIGN_XR_MANAGER'; xr: WebXRManager }
  | { type: 'ASSIGN_REF_SPACE_ORIGIN'; refSpace: XRReferenceSpace }
  | { type: 'ASSIGN_PLAYER'; player: Group }
  | { type: 'ASSIGN_LEFT_CONTROLLER'; controller: XRController }
  | { type: 'ASSIGN_RIGHT_CONTROLLER'; controller: XRController }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'RESET_REF_SPACE' }
  | { type: 'ASSIGN_POSE'; pose: XRViewerPose }
  | { type: 'ADJUST_REF_SPACE_TO_POSE'; pose: XRViewerPose };

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
      getThree: null!,
      getXR: null!,
      xr: null,
      refSpaceOrigin: null,
      session: null,
      player: null,
      leftController: null,
      rightController: null,
      pose: null,
    }),

    on: {
      ASSIGN_GET_THREE: {
        actions: [
          'logEvent',
          assign({
            getThree: (_, { getThree }) => getThree,
          }),
        ],
      },
      ASSIGN_GET_XR: {
        actions: [
          'logEvent',
          assign({
            getXR: (_, { getXR }) => getXR,
          }),
        ],
      },
      ASSIGN_XR_MANAGER: {
        actions: [
          'logEvent',
          assign({
            xr: (_, { xr }) => xr,
          }),
        ],
      },
      ASSIGN_REF_SPACE_ORIGIN: {
        actions: [
          'logEvent',
          assign({
            refSpaceOrigin: (_, { refSpace }) => refSpace,
          }),
        ],
      },
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
      RESET_REF_SPACE: {
        actions: ['logEvent', 'resetRefSpace'],
      },
      ASSIGN_POSE: {
        actions: [
          assign({
            pose: (_, { pose }) => pose,
          }),
        ],
      },
      ADJUST_REF_SPACE_TO_POSE: {
        actions: ['adjustRefSpaceToPose'],
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
            depthNear: NEAR_CLIP,
            depthFar: FAR_CLIP,
          });
        } catch (err) {
          console.error('Error! failed to init XR session render state:', err);
        }
      },
      initializePlayer: ({ player }) => {
        if (!player) return;
      },
      initializeController: ({ session }, { controller }) => {
        if (!session) return;
        const inputSource = controller.inputSource;
        const gamepad = inputSource.gamepad;
      },
      update: ({ session, rightController, leftController }, { deltaTime }) => {
        //
      },

      resetRefSpace: (context) => {
        const { getThree, refSpaceOrigin, xr } = context;
        if (!refSpaceOrigin) return;
        xr?.setReferenceSpace(refSpaceOrigin);
      },
      adjustRefSpaceToPose: (context, { pose }) => {
        if (!pose) return;
        const { getThree } = context;
        const { gl } = getThree();
        const xr = gl.xr;
        const session = xr.getSession();
        if (!session) return;

        const refSpace = xr.getReferenceSpace();
        if (!refSpace) return;

        // Get position and orientation from pose.
        const pos = pose.transform.position;
        const orientation = pose.transform.orientation;
        // Negate the y translation but preserve the orientation.
        const offsetTransform = new XRRigidTransform(
          { x: 0, y: pos.y, z: 0 } // Y must be positive.
          // orientation
        );

        const offsetRefSpace =
          refSpace.getOffsetReferenceSpace(offsetTransform);

        xr.setReferenceSpace(offsetRefSpace);
      },
    },
  }
);
