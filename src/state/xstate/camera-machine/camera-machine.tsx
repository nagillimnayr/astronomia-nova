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
import { DIST_MULT, SUN_RADIUS, METER } from '@/simulation/utils/constants';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';
import { type RootState, type BaseInstance } from '@react-three/fiber';
import { CameraController } from '@/lib/camera-controller/CameraController';

const _targetWorldPos = new Vector3();
const _observerWorldPos = new Vector3();
const _observerUp = new Vector3();

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
  // controls: (CameraControls & BaseInstance) | null;
  controls: CameraController | null;
  spaceCamera: PerspectiveCamera | null;
  surfaceCamera: PerspectiveCamera | null;
  focusTarget: Object3D | null;
  observer: Object3D | null;
};

type Events =
  | { type: 'TO_SURFACE' }
  | { type: 'TO_SPACE' }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ASSIGN_CANVAS'; canvas: HTMLCanvasElement }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  // | { type: 'ASSIGN_CONTROLS'; controls: CameraControls & BaseInstance }
  | { type: 'ASSIGN_CONTROLS'; controls: CameraController }
  | { type: 'ASSIGN_SPACE_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_SURFACE_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'SET_TARGET'; focusTarget: Object3D | null };

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
      getThree: null!,
      spaceCamera: null,
      surfaceCamera: null,
      observer: null,
      focusTarget: null,
    }),

    // Context assignment events:
    on: {
      ASSIGN_CANVAS: {
        actions: ['assignCanvas', 'logEvent', 'initializeControls'],
      },
      ASSIGN_GET_THREE: {
        actions: ['assignGetThree'],
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
            actions: 'updateSpaceView',
          },
          SET_TARGET: {
            internal: true,
            actions: ['assignTarget', 'setSpaceCamDistance'],
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
        },
      },
      surface: {
        entry: [
          'enterSurfaceView',
          'applySurfaceCamUp',
          'setSurfaceCamDistance',
        ],
        // Cleanup on exit:
        exit: ['cleanupSurfaceCam', log('exiting surface view')],
        on: {
          // UPDATE event:
          UPDATE: {
            internal: true,
            // Run action on self-transition.
            actions: ['updateSurfaceView', 'applySurfaceCamUp'],
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
            actions: [log('TO_SPACE')],
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
      assignControls: assign({
        controls: (_, event) => {
          // event.controls.mouseButtons.right = 8; // Zoom on right mouse button
          return event.controls;
        },
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
        // console.log('controls __r3f:', controls.__r3f);

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
      updateSpaceView: (context, event) => {
        const { controls, spaceCamera } = context;
        if (!controls || !spaceCamera) {
          console.error('camera controls are null');
          return;
        }
        const focusTarget = context.focusTarget;
        // if (!focusTarget) return;

        // // Get world position of focus target.
        // focusTarget.getWorldPosition(_targetWorldPos);

        // Update controls to follow target.
        // controls.moveTo(..._targetWorldPos.toArray(), false).catch((reason) => {
        //   console.log('error updating camera controls: ', reason);
        // });

        // Force the controls to update the camera.
        controls.update(event.deltaTime);
      },
      enterSurfaceView: (context, event) => {
        const { controls, surfaceCamera, observer, focusTarget } = context;
        if (!controls || !surfaceCamera || !observer || !focusTarget) return;
        observer.getWorldPosition(_observerWorldPos);
        controls.camera = surfaceCamera;

        console.log('surface cam:', surfaceCamera);
      },
      updateSurfaceView: (context, event) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
        observer.getWorldPosition(_observerWorldPos);
        // Update controls to follow target.
        // controls
        //   .moveTo(..._observerWorldPos.toArray(), false)
        //   .catch((reason) => {
        //     console.log('error updating camera controls: ', reason);
        //   });
        // Force the controls to update the camera.
        controls.update(event.deltaTime);
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

        // Set the camera's up vector to be relative to the surface.
        surfaceCamera.up.set(...getLocalUpInWorldCoords(observer));
        // controls.applyCameraUp();
      },
      applySpaceCamUp: (context) => {
        // Reset up vector of camera.
        const { controls, spaceCamera } = context;
        if (!controls || !spaceCamera) return;
        spaceCamera.up.set(0, 1, 0);
        // controls.applyCameraUp();
      },
      setSpaceCamDistance: (context) => {
        const { controls, focusTarget } = context;
        if (!controls) return;

        controls.maxDistance = SPACE_MAX_DIST;
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
          // if (controls.distance < minDistance) {
          //   controls
          //     .dollyTo(minDistance, false)
          //     .catch((reason) => console.log(reason));
          // }
        }
      },
      setSurfaceCamDistance: (context) => {
        const { controls } = context;
        if (!controls) return;
        controls.minDistance = SURFACE_MIN_DIST;
        controls.maxDistance = SURFACE_MAX_DIST;
        // if (controls.distance > SURFACE_MIN_DIST) {
        //   controls
        //     .dollyTo(SURFACE_MIN_DIST, true)
        //     .catch((reason) => console.log(reason));
        // } else if (controls.distance < SURFACE_MAX_DIST) {
        //   controls
        //     .dollyTo(SURFACE_MAX_DIST, true)
        //     .catch((reason) => console.log(reason));
        // }
      },
    },
  }
);
