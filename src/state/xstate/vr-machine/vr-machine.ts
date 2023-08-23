import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { type RootState } from '@react-three/fiber';
import { type XRState, type XRController } from '@react-three/xr';
import { Object3D, type Group, Vector3, type WebXRManager } from 'three';
import { assign, createMachine, log } from 'xstate';

const EPSILON = 1e-16;
const MIN_NEAR = EPSILON;
const MIN_FAR = 10;
const DEFAULT_NEAR = 0.1;
const DEFAULT_FAR = 1000;
const MAX_NEAR = DEFAULT_NEAR;

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
  lastInputEvent: XRInputSourceEvent | null;
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
  | { type: 'ADJUST_REF_SPACE_TO_POSE' }
  | { type: 'ASSIGN_INPUT_EVENT'; inputEvent: XRInputSourceEvent }
  | { type: 'INCREASE_NEAR'; value: number }
  | { type: 'INCREASE_FAR'; value: number }
  | { type: 'RESET_FRUSTUM' };

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
      lastInputEvent: null,
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
    },

    initial: 'inactive',
    states: {
      inactive: {
        on: {
          START_SESSION: {
            cond: (context, event) => context.session !== event.session,
            actions: ['logEvent', 'assignSession', 'startSession'],
            target: 'active',
          },
        },
      },
      active: {
        on: {
          END_SESSION: {
            actions: ['logEvent', 'endSession'],
            target: 'inactive',
          },
          UPDATE: {
            cond: ({ session, player }) => Boolean(session && player),
            actions: ['update'],
          },
          ASSIGN_POSE: {
            actions: [
              assign({
                pose: (_, { pose }) => pose,
              }),
              'adjustRefSpaceToPose',
            ],
          },
          ADJUST_REF_SPACE_TO_POSE: {
            actions: ['adjustRefSpaceToPose'],
          },
          ASSIGN_INPUT_EVENT: {
            actions: [
              assign({
                lastInputEvent: (_, { inputEvent }) => inputEvent,
              }),
            ],
          },
          INCREASE_NEAR: {
            actions: ['logEvent', 'increaseNear'],
          },
          INCREASE_FAR: {
            actions: ['logEvent', 'increaseFar'],
          },
          RESET_FRUSTUM: {
            actions: ['logEvent', 'resetFrustum'],
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
      startSession: (context, event) => {
        const { session } = context;
        if (!session) throw new Error('Error! XRSession is null');
      },
      endSession(context, event, meta) {
        //
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
      adjustRefSpaceToPose: (context) => {
        const { getThree, pose, refSpaceOrigin } = context;
        if (!pose || !refSpaceOrigin) return;
        const { gl } = getThree();
        const xr = gl.xr;
        if (!xr.isPresenting) return;

        if (!pose) return;

        // Get position and orientation from pose.
        const pos = pose.transform.position;
        const orientation = pose.transform.orientation;

        // Negate the translation but preserve the orientation.
        const offsetTransform = new XRRigidTransform(pos);

        const offsetRefSpace =
          refSpaceOrigin.getOffsetReferenceSpace(offsetTransform);

        xr.setReferenceSpace(offsetRefSpace);
      },
      increaseNear({ getXR }, { value }, meta) {
        const { session } = getXR();
        if (!session) return;
        const { depthNear, depthFar } = session.renderState;
        console.log('near:', depthNear);
        console.log('far:', depthFar);
        const near = Math.max(MIN_NEAR, depthNear + value);
        // Update near plane.
        void session.updateRenderState({
          depthNear: near,
        });
      },
      increaseFar({ getXR }, { value }, meta) {
        const { session } = getXR();
        if (!session) return;
        const { depthNear, depthFar } = session.renderState;
        console.log('near:', depthNear);
        console.log('far:', depthFar);
        const far = Math.max(MIN_FAR, depthFar + value);
        // Update far plane.
        void session.updateRenderState({
          depthFar: far,
        });
      },
      resetFrustum({ getXR }, event, meta) {
        const { session } = getXR();
        if (!session) return;

        // Reset frustum.
        void session.updateRenderState({
          depthNear: DEFAULT_NEAR,
          depthFar: DEFAULT_FAR,
        });
      },
    },
    guards: {},
  }
);
