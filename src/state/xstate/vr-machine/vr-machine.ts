import { type RootState } from '@react-three/fiber';
import { type XRState } from '@react-three/xr';
import { type Object3D, type Vector3Tuple } from 'three';
import { assign, createMachine } from 'xstate';

const EPSILON = 1e-16;
const MIN_NEAR = EPSILON;
const MIN_FAR = 10;

const DEFAULT_HUD_POS: Vector3Tuple = [0, 0, -5];

type Context = {
  getThree: () => RootState;
  getXR: () => XRState;
  refSpaceOrigin: XRReferenceSpace | null;
  pose: XRViewerPose | null;
  lastInputEvent: XRInputSourceEvent | null;
  vrHud: Object3D | null;
};

type Events =
  | { type: 'START_SESSION' }
  | { type: 'END_SESSION' }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  | { type: 'ASSIGN_GET_XR'; getXR: () => XRState }
  | { type: 'ASSIGN_VR_HUD'; vrHud: Object3D }
  | { type: 'UPDATE'; frame: XRFrame }
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

      ASSIGN_VR_HUD: {
        actions: [
          'logEvent',
          assign({
            vrHud: (_, { vrHud }) => vrHud,
          }),
        ],
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

          ASSIGN_INPUT_EVENT: {
            actions: [
              assign({
                lastInputEvent: (_, { inputEvent }) => inputEvent,
              }),
            ],
          },
          RESET_FRUSTUM: {
            actions: ['logEvent', 'resetFrustum'],
          },
          INCREASE_NEAR: {
            actions: ['logEvent', 'increaseNear'],
          },
          INCREASE_FAR: {
            actions: ['logEvent', 'increaseFar'],
          },
          RESET_HUD: {
            actions: ['logEvent', 'resetHud'],
          },
          INCREASE_HUD_X: {
            actions: ['logEvent', 'increaseHudX'],
          },
          INCREASE_HUD_Y: {
            actions: ['logEvent', 'increaseHudY'],
          },
          INCREASE_HUD_Z: {
            actions: ['logEvent', 'increaseHudZ'],
          },
        },
      },
    },
  },

  {
    actions: {
      // Other actions:
      // logEvent: log((_, event) => event),
      logEvent: () => {
        return;
      },
      startSession: () => {
        //
      },
      endSession() {
        //
      },

      update: ({ getThree }, { frame }) => {
        const { gl } = getThree();
        const { xr } = gl;
        // Get current reference space.
        const refSpace = xr.getReferenceSpace();

        if (!refSpace) {
          console.error('Error: No reference space!');
          return;
        }

        // Get viewer pose relative to the current reference space.
        const pose = frame.getViewerPose(refSpace);
        if (!pose) {
          console.error('Error: No pose!');
          return;
        }

        // Get position from pose.
        const { position } = pose.transform;

        // Create rigid transform from the pose position.
        const offsetTransform = new XRRigidTransform(position);

        // Create offset reference space from position. Leave orientation
        // undefined.
        const offsetRefSpace =
          refSpace.getOffsetReferenceSpace(offsetTransform);

        /* Set new reference space with offset. This will negate the
         translation component of the transformation matrix of the headset's
         spatially tracked position relative to the session origin, but
         without affecting the spatially tracked orientation, which we want
         to preserve. */
        xr.setReferenceSpace(offsetRefSpace);
      },

      increaseNear({ getXR }, { value }) {
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
      increaseFar({ getXR }, { value }) {
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
      resetFrustum({ getXR }) {
        const { isPresenting } = getXR();
        if (!isPresenting) return;

        // Reset frustum.
        // void session.updateRenderState({
        //   depthNear: DEFAULT_NEAR,
        //   depthFar: DEFAULT_FAR,
        // });
      },
      resetHud({ vrHud }) {
        if (!vrHud) return;
        vrHud.position.set(...DEFAULT_HUD_POS);
      },
      increaseHudX({ vrHud }, { value }) {
        if (!vrHud) return;
        vrHud.translateX(value);
      },
      increaseHudY({ vrHud }, { value }) {
        if (!vrHud) return;
        vrHud.translateY(value);
      },
      increaseHudZ({ vrHud }, { value }) {
        if (!vrHud) return;
        vrHud.translateZ(value);
      },
    },
  }
);
