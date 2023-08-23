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
  refSpaceOrigin: XRReferenceSpace | null;
  pose: XRViewerPose | null;
  lastInputEvent: XRInputSourceEvent | null;
  vrHud: Object3D | null;
};

type Events =
  | { type: 'START_SESSION'; session: XRSession }
  | { type: 'END_SESSION' }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  | { type: 'ASSIGN_GET_XR'; getXR: () => XRState }
  | { type: 'ASSIGN_VR_HUD'; vrHud: Object3D }
  | { type: 'ASSIGN_REF_SPACE_ORIGIN'; refSpace: XRReferenceSpace }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'RESET_REF_SPACE' }
  | { type: 'ASSIGN_POSE'; pose: XRViewerPose }
  | { type: 'ADJUST_REF_SPACE_TO_POSE' }
  | { type: 'ASSIGN_INPUT_EVENT'; inputEvent: XRInputSourceEvent }
  | { type: 'RESET_FRUSTUM' }
  | { type: 'INCREASE_NEAR'; value: number }
  | { type: 'INCREASE_FAR'; value: number }
  | { type: 'RESET_HUD' }
  | { type: 'INCREASE_HUD_Y'; value: number }
  | { type: 'INCREASE_HUD_X'; value: number }
  | { type: 'INCREASE_HUD_Z'; value: number };

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
      refSpaceOrigin: null,
      pose: null,
      lastInputEvent: null,
      vrHud: null,
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
      ASSIGN_VR_HUD: {
        actions: [
          'logEvent',
          assign({
            vrHud: (_, { vrHud }) => vrHud,
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
      RESET_REF_SPACE: {
        actions: ['logEvent', 'resetRefSpace'],
      },
    },

    initial: 'inactive',
    states: {
      inactive: {
        on: {
          START_SESSION: {
            actions: ['logEvent', 'startSession'],
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
      // Other actions:
      logEvent: log((_, event) => event),
      startSession: (context, event) => {
        //
      },
      endSession(context, event, meta) {
        //
      },

      update: ({ getThree, getXR }, { deltaTime }) => {
        //
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
  }
);
