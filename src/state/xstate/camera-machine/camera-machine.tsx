import { assign, createMachine, log } from 'xstate';
import {
  type Object3D,
  Vector3,
  type PerspectiveCamera,
  Scene,
  Group,
} from 'three';
import { type CameraControls } from '@react-three/drei';
import KeplerBody from '@/simulation/classes/kepler-body';
import {
  DIST_MULT,
  SUN_RADIUS,
  METER,
  PI_OVER_TWO,
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

const X_AXIS: Readonly<Vector3> = new Vector3(1, 0, 0);
const _targetWorldPos = new Vector3();
const _observerWorldPos = new Vector3();
const _observerUp = new Vector3();

const _cameraWorldDirection = new Vector3();
const _worldPos = new Vector3();
const _lookPos = new Vector3();

// Space view constants:
const SPACE_MAX_DIST: Readonly<number> = 1e12;
const SPACE_MIN_DIST_FROM_SURFACE: Readonly<number> = 1e-3;

// Surface view constants:
const SURFACE_MIN_DIST: Readonly<number> = METER * 1e-1;
const SURFACE_MAX_DIST: Readonly<number> = 1.5 * SURFACE_MIN_DIST;
const SURFACE_MIN_DIST_FROM_SURFACE: Readonly<number> = 2 * METER; // 2 meters above ground

type Context = {
  canvas: HTMLCanvasElement; // Reference to the canvas element.
  getThree: () => RootState;
  getXR: () => XRState;
  xrSession: XRSession | null;
  controls: CameraController | null;
  spaceCamera: PerspectiveCamera | null;
  surfaceCamera: PerspectiveCamera | null;
  focusTarget: Object3D | null;
  observer: Object3D | null;
  refSpace: XRReferenceSpace | null;
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
  | { type: 'ASSIGN_SPACE_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_SURFACE_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'ASSIGN_REF_SPACE'; refSpace: XRReferenceSpace }
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
      spaceCamera: null,
      surfaceCamera: null,
      observer: null,
      focusTarget: null,
      refSpace: null,
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

      ASSIGN_SPACE_CAMERA: {
        cond: (context, event) => {
          return context.spaceCamera !== event.camera;
        },
        actions: [
          assign({ spaceCamera: (_, event) => event.camera }),
          log((context, event) => {
            return event.camera;
          }, 'Assign space camera'),
          'initializeControls',
        ],
      },
      ASSIGN_SURFACE_CAMERA: {
        cond: (context, event) => {
          return context.surfaceCamera !== event.camera;
        },
        actions: [
          assign({ surfaceCamera: (_, event) => event.camera }),
          log('Assigning surface camera!'),
          'initializeControls',
        ],
      },
      ASSIGN_OBSERVER: {
        cond: (context, event) => {
          return context.observer !== event.observer;
        },
        actions: [
          assign({ observer: (_, event) => event.observer }),
          'cleanupSurfaceCam',
        ],
      },
      ASSIGN_REF_SPACE: {
        actions: ['logEvent', 'assignRefSpace', 'initRefSpace'],
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
    },

    initial: 'space', // Start in 'space' view-mode.

    states: {
      space: {
        entry: ['applySpaceCamUp', 'setSpaceCamDistance'],
        // Cleanup on exit:
        exit: (context) => {
          const { spaceCamera, observer } = context;
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
              'assignControls',
              log('Assigning camera controls!'),
              // log((context) => context.controls),
              // log((_, event) => event.controls),
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
        exit: [
          log('exiting surface view'),
          'cleanupSurfaceCam',
          'attachToTarget',
        ],
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
              'assignControls',
              log('Assigning camera controls!'),
              'setSurfaceCamDistance',
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
        const { controls, spaceCamera, surfaceCamera, canvas } = context;
        if (!controls) return;

        if (
          spaceCamera &&
          (!controls.camera || spaceCamera.parent !== controls)
        ) {
          controls.setCamera(spaceCamera);
        }

        if (canvas && !controls.domElement) {
          controls.setDomElement(canvas);
        }
        console.log('controls:', controls);
        console.log('surface cam:', surfaceCamera);
        console.log('space cam:', spaceCamera);
      },
      startXRSession: (context, event) => {
        //
        const { xrSession, getXR, getThree, controls } = context;
        if (!xrSession || !getXR || !controls) {
          console.error('error initializing xr session');
          return;
        }

        // const { gl } = getThree();
        // const xr = gl.xr;
        // const glXRSession = gl.xr.getSession();
        // console.log('xrSession:', xrSession);
        // console.log('glXRSession:', glXRSession);
        // console.log('xr enabled?', gl.xr.enabled);
        // console.log('xr frame', gl.xr.getFrame());
        // console.log('xr camera', gl.xr.getCamera());
        // console.log('xr controller 1', gl.xr.getController(1));
        // const refSpace = xr.getReferenceSpace();
        // console.log('xr reference space', refSpace);

        const { player } = getXR();
        controls.attachToController(player);
        controls.camera.getWorldDirection(_cameraWorldDirection);
        player.up.set(...getLocalUpInWorldCoords(controls.camera));
        player.getWorldPosition(_worldPos);
        _lookPos.addVectors(_worldPos, _cameraWorldDirection);
        player.lookAt(_lookPos);
        console.log('Attaching VR Player to camera!');
      },
      initRefSpace: (context, event) => {
        const { getThree } = context;
        const { refSpace } = event;
        const xr = getThree().gl.xr;

        xr.setReferenceSpace(refSpace);
        console.log('initial refSpace:', refSpace);
      },
      attachToTarget: (context, event) => {
        const { controls, spaceCamera, focusTarget } = context;
        if (!focusTarget || !controls) return;
        // focusTarget.add(controls);
        controls.attachControllerTo(focusTarget);
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
        const { controls, spaceCamera } = context;
        if (!controls || !spaceCamera) {
          console.error('camera controls are null');
          return;
        }
        controls.update(event.deltaTime);
      },
      updateSpaceView: (context, event) => {
        const { controls, spaceCamera } = context;
        if (!controls || !spaceCamera) {
          console.error('camera controls are null');
          return;
        }

        // controls.update(event.deltaTime);
      },
      enterSurfaceView: (context, event) => {
        const { controls, surfaceCamera, observer, focusTarget } = context;
        if (!controls || !surfaceCamera || !observer || !focusTarget) return;
        // observer.getWorldPosition(_observerWorldPos);
        // controls.camera = surfaceCamera;

        // console.log('surface cam:', surfaceCamera);
      },
      updateSurfaceView: (context, event) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
      },
      cleanupSurfaceCam: (context) => {
        const { controls, surfaceCamera, observer } = context;
        if (!controls || !surfaceCamera || !observer) return;

        // Attach the camera to the observer.
        const parent = surfaceCamera.parent;
        if (!parent || parent instanceof Scene) return;
        observer.add(parent);
        // Reset surface camera.
        surfaceCamera.position.set(0, 0, 1e-3);
        surfaceCamera.rotation.set(0, 0, 0);
        surfaceCamera.updateProjectionMatrix();
      },
      applySurfaceCamUp: (context) => {
        const { controls, surfaceCamera, observer, focusTarget } = context;
        if (!controls || !surfaceCamera || !observer || !focusTarget) return;
        controls.rotation.set(0, 0, 0); // Reset rotation.
        // Set the camera's up vector to be relative to the surface.
        // surfaceCamera.up.set(...getLocalUpInWorldCoords(observer));
        // controls.applyCameraUp();
      },
      applySpaceCamUp: (context) => {
        // Reset up vector of camera.
        const { controls, spaceCamera } = context;
        if (!controls || !spaceCamera) return;
        controls.applyWorldUp();
      },
      setSpaceCamDistance: (context) => {
        const { controls, focusTarget } = context;
        if (!controls) return;

        // controls.maxDistance = SPACE_MAX_DIST;
        controls.maxDistance = Infinity;
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
        const { controls, spaceCamera } = context;
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
