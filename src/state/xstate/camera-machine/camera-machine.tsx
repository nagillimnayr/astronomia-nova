import { assign, createMachine, log } from 'xstate';
import {
  type Object3D,
  Vector3,
  type PerspectiveCamera,
  Scene,
  Group,
  ArrayCamera,
} from 'three';
import KeplerBody from '@/simulation/classes/kepler-body';
import {
  DIST_MULT,
  SUN_RADIUS,
  METER,
  PI_OVER_TWO,
  SIMULATION_RADIUS,
} from '@/simulation/utils/constants';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { type RootState } from '@react-three/fiber';
import { type CameraController } from '@/lib/camera-controller/CameraController';
import {
  FAR_CLIP,
  NEAR_CLIP,
  SURFACE_NEAR_CLIP,
} from '@/components/canvas/scene-constants';
import { type XRState } from '@react-three/xr';

const _observerUp = new Vector3();
const _xrCam1WorldPos = new Vector3();
const _xrCam2WorldPos = new Vector3();

const NEPTUNE_APOAPSIS = 4553758200000 * METER;

// Space view constants:
const SPACE_MAX_DIST = SIMULATION_RADIUS - NEPTUNE_APOAPSIS;
const SPACE_MIN_DIST_FROM_SURFACE = 1e-3;

// Surface view constants:
const SURFACE_MIN_DIST = METER * 1e-1;
const SURFACE_MAX_DIST = 1.5 * SURFACE_MIN_DIST;
const SURFACE_MIN_DIST_FROM_SURFACE = 2 * METER; // 2 meters above ground

// Z position of VR Hud.
const VR_HUD_Z_NON_IMMERSIVE = -5;
// const VR_HUD_Z_IMMERSIVE = -2.5;
const VR_HUD_Z_IMMERSIVE = -3;

// Default FOV.
const FOV = 50;

type Context = {
  getThree: () => RootState;
  getXR: () => XRState;
  controls: CameraController | null;
  mainCamera: PerspectiveCamera | null;
  focusTarget: Object3D | null;
  observer: Object3D | null;
  vrHud: Object3D | null;
};

type Events =
  | { type: 'TO_SURFACE' }
  | { type: 'TO_SPACE' }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  | { type: 'START_XR_SESSION' }
  | { type: 'END_XR_SESSION' }
  | { type: 'ASSIGN_CONTROLS'; controls: CameraController }
  | { type: 'ASSIGN_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'ASSIGN_VR_HUD'; vrHud: Object3D }
  | { type: 'SET_TARGET'; focusTarget: Object3D | null }
  | { type: 'ROTATE_AZIMUTHAL'; deltaAngle: number }
  | { type: 'ROTATE_POLAR'; deltaAngle: number }
  | { type: 'ZOOM'; deltaZoom: number }
  | { type: 'RESET_REF_SPACE' }
  | { type: 'HIDE_VR_HUD' }
  | { type: 'SHOW_VR_HUD' }
  | { type: 'LOCK_CONTROLS' }
  | { type: 'UNLOCK_CONTROLS' };

export const cameraMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./camera-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'camera-machine',
    // Initial context:
    context: () => ({
      controls: null,
      getThree: null!,
      getXR: null!,
      mainCamera: null,
      observer: null,
      focusTarget: null,
      vrHud: null,
    }),

    // Context assignment events:
    on: {
      ASSIGN_GET_THREE: {
        actions: ['logEvent', 'assignGetThree', 'initializeControls'],
      },

      ASSIGN_CONTROLS: {
        cond: (context, event) => {
          return context.controls !== event.controls;
        },
        actions: ['logEvent', 'assignControls', 'initializeControls'],
      },
      ASSIGN_CAMERA: {
        actions: [
          assign({ mainCamera: (_, event) => event.camera }),
          'logEvent',
          'setCamera',
          'initializeControls',
        ],
      },
      ASSIGN_OBSERVER: {
        cond: (context, event) => {
          return context.observer !== event.observer;
        },
        actions: [
          assign({ observer: (_, event) => event.observer }),
          'logEvent',
        ],
      },

      ASSIGN_VR_HUD: {
        actions: [
          'logEvent',
          assign({
            vrHud: (_, { vrHud }) => vrHud,
          }),
          'initializeControls',
        ],
      },
      ROTATE_AZIMUTHAL: {
        actions: ['rotateAzimuthal'],
      },

      ROTATE_POLAR: {
        actions: ['rotatePolar'],
      },

      ZOOM: {
        actions: ['addRadialZoom'],
      },

      END_XR_SESSION: {
        actions: ['logEvent', 'endXRSession'],
      },
      SHOW_VR_HUD: {
        actions: ['logEvent', 'showVRHud'],
      },
      HIDE_VR_HUD: {
        actions: ['logEvent', 'hideVRHud'],
      },
      LOCK_CONTROLS: {
        actions: ['logEvent', ({ controls }) => controls?.lock()],
      },
      UNLOCK_CONTROLS: {
        actions: ['logEvent', ({ controls }) => controls?.unlock()],
      },
    },

    initial: 'space', // Start in 'space' view-mode.

    states: {
      space: {
        entry: ['applySpaceCamUp', 'setSpaceCamDistance'],
        // Cleanup on exit:
        exit: (context) => {
          const { controls, observer } = context;
          if (!controls || !observer) return;
        },
        on: {
          // UPDATE event.
          UPDATE: {
            actions: ['updateCamera'],
          },
          SET_TARGET: {
            internal: true,
            actions: ['assignTarget', 'attachToTarget', 'setSpaceCamDistance'],
          },
          TO_SURFACE: {
            // Transition to 'surface' view-mode:
            target: 'surface',

            actions: ['logEvent'],
          },
          ASSIGN_CONTROLS: {
            cond: (context, event) => {
              return context.controls !== event.controls;
            },
            actions: [
              'logEvent',
              'assignControls',
              'setSpaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'startXRSession',
              // 'setSpaceCamDistance',
              // 'showVRHud',
            ],
          },
        },
      },
      surface: {
        entry: [
          'enterSurfaceView',
          'applySurfaceCamUp',
          'setSurfaceCamDistance',
          'attachToObserver',
        ],
        // Cleanup on exit:
        exit: ['logEvent', 'attachToTarget'],
        on: {
          // UPDATE event:
          UPDATE: {
            internal: true,
            actions: ['updateCamera', 'updateSurfaceView', 'applySurfaceCamUp'],
          },
          SET_TARGET: {
            internal: true,
            actions: [
              'logEvent',
              'assignTarget',
              'applySurfaceCamUp',
              'setSurfaceCamDistance',
            ],
          },
          TO_SPACE: {
            // Transition to 'space' view-mode:
            target: 'space',
            actions: ['logEvent'],
          },
          ASSIGN_CONTROLS: {
            cond: (context, event) => {
              return context.controls !== event.controls;
            },
            actions: [
              'logEvent',
              'assignControls',
              'setSurfaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'startXRSession',
              'setSurfaceCamDistance',
              // 'showVRHud',
            ],
          },
        },
      },
    },
  },
  {
    // Action implementations:
    actions: {
      logEvent: log((_, event) => event),

      assignGetThree: assign({
        getThree: (_, { getThree }) => getThree,
      }),
      assignControls: assign({
        controls: (_, event) => {
          return event.controls;
        },
      }),
      assignTarget: assign({
        // Set new focus target.
        focusTarget: (_, event) => {
          return event.focusTarget;
        },
      }),
      setCamera(context, event, meta) {
        const { controls } = context;
        const { camera } = event;
        controls?.setCamera(camera);
      },
      initializeControls: (context, event) => {
        const { controls, mainCamera, getThree, vrHud } = context;
        if (!controls) return;

        console.log('initializing controls!', event);

        if (mainCamera) {
          controls.setCamera(mainCamera);
        }

        if (getThree) {
          // Get canvas from store.
          const canvas = getThree().gl.domElement;
          if (canvas && !controls.domElement) {
            // Pass canvas to controls for setting up event listeners.
            controls.setDomElement(canvas);
          }
        }

        if (vrHud) {
          // Attach vrHud to controls.
          controls.attachToController(vrHud);
          vrHud.position.setZ(VR_HUD_Z_IMMERSIVE);
        }
      },
      startXRSession: (context, event) => {
        const { getThree, controls, vrHud } = context;
        if (!controls) {
          console.error('error initializing xr session. Controls are null.');
          return;
        }

        const { xr } = getThree().gl;

        // XR camera may not be set yet, so set timeout.
        setTimeout(() => {
          const xrCamera = xr.getCamera();
          if (xrCamera && xrCamera.name !== 'xr-camera') {
            console.log('xrCamera:', xrCamera);
            xrCamera.name = 'xr-camera';
            const [xrCam1, xrCam2] = xrCamera.cameras;
            xrCam1.name = 'xrCam1';
            xrCam2.name = 'xrCam2';
          }
        }, 100);

        // Position vrHud.
        if (vrHud) {
          vrHud.position.setZ(VR_HUD_Z_IMMERSIVE);
        }
      },
      endXRSession: (context, event) => {
        const { vrHud, controls, mainCamera, getThree } = context;
        if (vrHud) {
          console.log('VRHUD:', vrHud);
          // vrHud.position.setZ(VR_HUD_Z_NON_IMMERSIVE);
        }

        const { gl } = getThree();
        const xrCamera = gl.xr.getCamera();
        console.log('gl.xr camera:', gl.xr.getCamera());

        if (mainCamera) {
          // Need to reset the FOV because it gets messed up for some reason.
          mainCamera.rotation.set(0, 0, 0);
          mainCamera.fov = FOV;
          console.log('mainCamera:', mainCamera);
        }
        if (xrCamera) {
          console.log('xr camera:', xrCamera);
          controls?.attachToController(xrCamera);
          xrCamera.rotation.set(0, 0, 0);
          console.log('xr camera:', xrCamera);
        }
      },

      attachToTarget: (context, event) => {
        const { controls, focusTarget } = context;
        if (!focusTarget || !controls) return;
        // controls.attachControllerTo(focusTarget);
        controls.attachToWithoutMoving(focusTarget);
        controls.applyWorldUp();
      },
      attachToObserver: (context, event) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
        controls.attachControllerTo(observer);
        _observerUp.set(...getLocalUpInWorldCoords(observer));
        controls.up.copy(_observerUp);

        controls.camera.up.copy(controls.up);
      },

      updateCamera: (context, event) => {
        const { controls } = context;

        if (!controls) {
          return;
        }
        controls.update(event.deltaTime);
      },

      enterSurfaceView: (context, event) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;

        // Set polar angle to be horizontal relative to the surface.
        controls.setPolarAngleTarget(PI_OVER_TWO);
      },
      updateSurfaceView: (context, event) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
      },

      applySurfaceCamUp: (context) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;
        controls.rotation.set(0, 0, 0); // Reset rotation.
      },
      applySpaceCamUp: (context) => {
        // Reset up vector of camera.
        const { controls } = context;
        if (!controls) return;
        controls.applyWorldUp();
      },
      setSpaceCamDistance: (context) => {
        const { controls, focusTarget } = context;
        if (!controls) return;

        controls.maxDistance = SPACE_MAX_DIST;
        // controls.maxDistance = Infinity;
        if (!focusTarget) {
          controls.minDistance =
            SPACE_MIN_DIST_FROM_SURFACE + SUN_RADIUS / DIST_MULT;
          return;
        }
        // Type guard.
        if (!(focusTarget instanceof KeplerBody)) {
          console.error('error! focusTarget is not a KeplerBody');
          return;
        }
        const body = context.focusTarget as KeplerBody; // Cast to KeplerBody.
        if (body && controls) {
          const radius = body.meanRadius / DIST_MULT;
          const minDistance = SPACE_MIN_DIST_FROM_SURFACE + radius;

          // Set min distance relative to focus targets radius.
          controls.minDistance = minDistance;
          controls.camera.near = NEAR_CLIP;
        }
      },
      setSurfaceCamDistance: (context) => {
        const { controls } = context;
        if (!controls || !controls?.camera) return;
        controls.minDistance = SURFACE_MIN_DIST;
        controls.maxDistance = SURFACE_MAX_DIST;

        controls.camera.near = SURFACE_NEAR_CLIP;
      },
      rotateAzimuthal: ({ controls }, event) => {
        if (!controls) return;
        controls.addAzimuthalRotation(event.deltaAngle);
      },
      rotatePolar: ({ controls }, event) => {
        if (!controls) return;
        controls.addPolarRotation(event.deltaAngle);
      },
      addRadialZoom: ({ controls }, event) => {
        if (!controls) return;
        controls.addRadialZoom(event.deltaZoom);
      },
      showVRHud: (context) => {
        const { vrHud } = context;
        if (!vrHud) return;
        vrHud.visible = true;
      },
      hideVRHud: (context) => {
        const { vrHud } = context;
        if (!vrHud) return;
        vrHud.visible = false;
      },
    },
  }
);
