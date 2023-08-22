import { assign, createMachine, log } from 'xstate';
import { type Object3D, Vector3, PerspectiveCamera, Scene, Group } from 'three';
import { type CameraControls } from '@react-three/drei';
import KeplerBody from '@/simulation/classes/kepler-body';
import {
  DIST_MULT,
  SUN_RADIUS,
  METER,
  PI_OVER_TWO,
  SIMULATION_RADIUS,
} from '@/simulation/utils/constants';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { type RootState, type BaseInstance } from '@react-three/fiber';
import { type CameraController } from '@/lib/camera-controller/CameraController';
import {
  FAR_CLIP,
  NEAR_CLIP,
  SURFACE_NEAR_CLIP,
} from '@/components/canvas/scene-constants';
import { XRState } from '@react-three/xr';

const _observerUp = new Vector3();

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

const FOV = 50;

type Context = {
  canvas: HTMLCanvasElement; // Reference to the canvas element.
  getThree: () => RootState;
  getXR: () => XRState;
  xrSession: XRSession | null;
  controls: CameraController | null;
  camera: PerspectiveCamera | null;
  focusTarget: Object3D | null;
  observer: Object3D | null;
  refSpace: XRReferenceSpace | null;
  vrHud: Object3D | null;
};

type Events =
  | { type: 'TO_SURFACE' }
  | { type: 'TO_SPACE' }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ASSIGN_CANVAS'; canvas: HTMLCanvasElement }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  | { type: 'ASSIGN_GET_XR'; getXR: () => XRState }
  | { type: 'START_XR_SESSION'; xrSession: XRSession }
  | { type: 'END_XR_SESSION' }
  | { type: 'POLL_XR_BUTTONS' }
  | { type: 'ASSIGN_CONTROLS'; controls: CameraController }
  | { type: 'ASSIGN_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'ASSIGN_REF_SPACE'; refSpace: XRReferenceSpace }
  | { type: 'ASSIGN_VR_HUD'; vrHud: Object3D }
  | { type: 'SET_TARGET'; focusTarget: Object3D | null }
  | { type: 'ROTATE_AZIMUTHAL'; deltaAngle: number }
  | { type: 'ROTATE_POLAR'; deltaAngle: number }
  | { type: 'ZOOM'; deltaZoom: number }
  | { type: 'RESET_REF_SPACE' };

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
      canvas: null!,
      controls: null,
      xrSession: null,
      getThree: null!,
      getXR: null!,
      camera: null,
      observer: null,
      focusTarget: null,
      refSpace: null,
      vrHud: null,
    }),

    // Context assignment events:
    on: {
      ASSIGN_CANVAS: {
        actions: ['assignCanvas', 'logEvent', 'initializeControls'],
      },
      ASSIGN_GET_THREE: {
        actions: ['assignGetThree'],
      },
      ASSIGN_GET_XR: {
        actions: ['assignGetXR', 'logEvent'],
      },
      ASSIGN_CONTROLS: {
        cond: (context, event) => {
          return context.controls !== event.controls;
        },
        actions: [
          'assignControls',
          (context, event) => {
            console.log(
              'Assigning camera controls!',
              context.controls,
              event.controls
            );
          },
          'initializeControls',
        ],
      },

      ASSIGN_CAMERA: {
        actions: [
          assign({ camera: (_, event) => event.camera }),
          log((context, event) => {
            return event.camera;
          }, 'Assign space camera'),
          'initializeControls',
        ],
      },
      ASSIGN_OBSERVER: {
        cond: (context, event) => {
          return context.observer !== event.observer;
        },
        actions: [assign({ observer: (_, event) => event.observer })],
      },
      ASSIGN_REF_SPACE: {
        actions: ['logEvent', 'assignRefSpace', 'initRefSpace'],
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

      POLL_XR_BUTTONS: {
        cond: ({ getXR }) => {
          return Boolean(getXR().session);
        },
        actions: ['pollXRButtons'],
      },

      END_XR_SESSION: {
        actions: ['logEvent', 'endXRSession'],
      },
    },

    initial: 'space', // Start in 'space' view-mode.

    states: {
      space: {
        entry: ['applySpaceCamUp', 'setSpaceCamDistance'],
        // Cleanup on exit:
        exit: (context) => {
          const { camera: spaceCamera, observer } = context;
          if (!spaceCamera || !observer) return;
        },
        on: {
          // UPDATE event.
          UPDATE: {
            internal: true,
            // Run action on self-transition.
            actions: ['pollXRInput', 'updateCamera', 'updateSpaceView'],
          },
          SET_TARGET: {
            internal: true,
            actions: ['assignTarget', 'attachToTarget', 'setSpaceCamDistance'],
          },
          TO_SURFACE: {
            // Transition to 'surface' view-mode:
            target: 'surface',

            actions: [log('TO_SURFACE')],
          },
          ASSIGN_CONTROLS: {
            cond: (context, event) => {
              return context.controls !== event.controls;
            },
            actions: [
              'logEvent',
              'assignControls',
              log('Assigning camera controls!'),
              'setSpaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'assignXRSession',
              'startXRSession',
              'setSpaceCamDistance',
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
        exit: ['logEvent', log('exiting surface view'), 'attachToTarget'],
        on: {
          // UPDATE event:
          UPDATE: {
            internal: true,
            // Run action on self-transition.
            actions: [
              'pollXRInput',
              'updateCamera',
              'updateSurfaceView',
              'applySurfaceCamUp',
            ],
          },
          SET_TARGET: {
            internal: true,
            actions: [
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
              log('Assigning camera controls!'),
              'setSurfaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'assignXRSession',
              'startXRSession',
              'setSurfaceCamDistance',
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
      assignCanvas: assign({
        canvas: (context, event) => {
          // Only assign the canvas if the one in context is uninitialized.
          if (context.canvas) return context.canvas;
          return event.canvas;
        },
      }),
      assignGetThree: assign({
        getThree: (_, { getThree }) => getThree,
      }),
      assignGetXR: assign({
        getXR: (_, { getXR }) => getXR,
      }),
      assignControls: assign({
        controls: (_, event) => {
          return event.controls;
        },
      }),
      assignXRSession: assign({
        xrSession: (_, { xrSession }) => xrSession,
      }),
      assignRefSpace: assign({
        refSpace: (_, { refSpace }) => refSpace,
      }),

      assignTarget: assign({
        // Set new focus target.
        focusTarget: (_, event) => {
          return event.focusTarget;
        },
      }),
      initializeControls: (context) => {
        const { controls, camera, canvas, vrHud } = context;
        if (!controls) return;

        if (camera) {
          controls.setCamera(camera);
        }

        if (canvas && !controls.domElement) {
          controls.setDomElement(canvas);
        }

        if (vrHud) {
          //
        }
        console.log('controls:', controls);
        console.log('camera:', camera);
      },
      startXRSession: (context, event) => {
        //
        const { xrSession, getXR, getThree, controls, vrHud } = context;
        if (!xrSession || !getXR || !controls) {
          console.error('error initializing xr session');
          return;
        }

        if (vrHud) {
          console.log('VRHUD:', vrHud);
          vrHud.visible = true;
          vrHud.position.setZ(VR_HUD_Z_IMMERSIVE);
        }
        const { camera, gl } = context.getThree();
        console.log('camera:', camera);
        console.log('xr camera:', gl.xr.getCamera());
      },
      endXRSession: (context, event) => {
        const { vrHud } = context;
        if (vrHud) {
          console.log('VRHUD:', vrHud);
          vrHud.visible = false;
          // vrHud.position.setZ(VR_HUD_Z_NON_IMMERSIVE);
        }

        const { camera, gl } = context.getThree();
        console.log('xr camera:', gl.xr.getCamera());
        // Need to reset the FOV because it gets messed up for some reason.
        if (camera instanceof PerspectiveCamera) {
          camera.fov = 50;
        }
        console.log('camera:', camera);
      },
      initRefSpace: (context, event) => {
        const { getThree } = context;
        const { refSpace } = event;
        const xr = getThree().gl.xr;

        xr.setReferenceSpace(refSpace);
        console.log('initial refSpace:', refSpace);
      },
      attachToTarget: (context, event) => {
        const { controls, camera: spaceCamera, focusTarget } = context;
        if (!focusTarget || !controls) return;
        // controls.attachControllerTo(focusTarget);
        controls.attachToWithoutMoving(focusTarget);
        controls.applyWorldUp();
      },
      attachToObserver: (context, event) => {
        //
        const { controls, observer } = context;
        if (!controls || !observer) return;
        controls.attachControllerTo(observer);
        _observerUp.set(...getLocalUpInWorldCoords(observer));
        controls.up.copy(_observerUp);

        controls.camera.up.copy(controls.up);
      },
      pollXRInput: (context) => {
        // Poll XR controllers for thumbstick input.
        const { controls, getXR } = context;
        const { session, controllers } = getXR();
        if (!session || !controllers || !controls) return;
        const leftController = controllers.find(
          (controllerObj) => controllerObj.inputSource.handedness === 'left'
        );
        const rightController = controllers.find(
          (controllerObj) => controllerObj.inputSource.handedness === 'right'
        );
        if (!leftController || !rightController) return;

        const leftGamepad = leftController.inputSource.gamepad;
        if (!leftGamepad) return;
        const rightGamepad = rightController.inputSource.gamepad;
        if (!rightGamepad) return;

        const leftAxes = leftGamepad.axes;
        const x = leftAxes[2];
        const zoom = leftAxes[3];

        const rightAxes = rightGamepad.axes;
        const azimuthal = rightAxes[2];
        const polar = rightAxes[3];

        if (azimuthal) {
          controls.addAzimuthalRotation(azimuthal * 2);
        }
        if (polar) {
          controls.addPolarRotation(polar * 2);
        }
        if (zoom) {
          controls.addRadialZoom(zoom / 4);
        }
      },
      pollXRButtons: (context) => {
        // Poll XR controllers for button input.
        const { controls, getXR } = context;
        const { session, controllers } = getXR();
        if (!session || !controllers || !controls) return;
        const leftController = controllers.find(
          (controllerObj) => controllerObj.inputSource.handedness === 'left'
        );
        const rightController = controllers.find(
          (controllerObj) => controllerObj.inputSource.handedness === 'right'
        );
        if (!leftController || !rightController) return;

        const leftGamepad = leftController.inputSource.gamepad;
        if (!leftGamepad) return;
        const rightGamepad = rightController.inputSource.gamepad;
        if (!rightGamepad) return;
        // Poll for button input.
        const leftButtons = leftGamepad.buttons;
        const rightButtons = rightGamepad.buttons;

        const buttonA = rightButtons.at(4);
        const buttonB = rightButtons.at(5);

        const buttonX = leftButtons.at(4);
        const buttonY = leftButtons.at(5);

        if (buttonA && buttonA.pressed) {
          console.log('button A');
        }

        if (buttonB && buttonB.pressed) {
          console.log('button B');
        }

        if (buttonX && buttonX.pressed) {
          console.log('button X');
        }

        if (buttonY && buttonY.pressed) {
          console.log('button Y');
        }
      },

      updateCamera: (context, event) => {
        const { controls, camera: spaceCamera } = context;
        if (!controls || !spaceCamera) {
          console.error('camera controls are null');
          return;
        }
        controls.update(event.deltaTime);
      },
      updateSpaceView: (context, event) => {
        const { controls, camera: spaceCamera } = context;
        if (!controls || !spaceCamera) {
          console.error('camera controls are null');
          return;
        }

        // controls.update(event.deltaTime);
      },
      enterSurfaceView: (context, event) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;
        // observer.getWorldPosition(_observerWorldPos);
        // controls.camera = surfaceCamera;

        // console.log('surface cam:', surfaceCamera);
      },
      updateSurfaceView: (context, event) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
      },

      applySurfaceCamUp: (context) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;
        controls.rotation.set(0, 0, 0); // Reset rotation.
        // Set the camera's up vector to be relative to the surface.
        // surfaceCamera.up.set(...getLocalUpInWorldCoords(observer));
        // controls.applyCameraUp();
      },
      applySpaceCamUp: (context) => {
        // Reset up vector of camera.
        const { controls, camera: spaceCamera } = context;
        if (!controls || !spaceCamera) return;
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

        // Update XR session frustum.
        const { session } = context.getXR();
        void session?.updateRenderState({
          depthNear: NEAR_CLIP,
          depthFar: FAR_CLIP,
        });
      },
      setSurfaceCamDistance: (context) => {
        const { controls, camera: spaceCamera } = context;
        if (!controls || !spaceCamera) return;
        controls.minDistance = SURFACE_MIN_DIST;
        controls.maxDistance = SURFACE_MAX_DIST;

        controls.camera.near = SURFACE_NEAR_CLIP;

        // Update XR session frustum.
        const { session } = context.getXR();
        void session?.updateRenderState({
          depthNear: SURFACE_NEAR_CLIP,
          depthFar: FAR_CLIP,
        });
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
    },
  }
);
