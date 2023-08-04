import { assign, createMachine, log } from 'xstate';
import { type Object3D, Vector3, type PerspectiveCamera } from 'three';
import { type CameraControls } from '@react-three/drei';
import KeplerBody from '@/simulation/classes/kepler-body';
import { EARTH_RADIUS } from '@/simulation/utils/constants';
import { type RootState } from '@react-three/fiber';
import { SUN_RADIUS } from '@/lib/utils/constants';

const _targetWorldPos = new Vector3();
const _observerWorldPos = new Vector3();
const _observerUp = new Vector3();

type Context = {
  canvas: HTMLCanvasElement; // Reference to the canvas element.
  getThree: (() => RootState) | null;
  controls: CameraControls | null;
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
  | { type: 'ASSIGN_THREE'; get: () => RootState }
  | { type: 'ASSIGN_CONTROLS'; controls: CameraControls }
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
      getThree: null,
      spaceCamera: null,
      surfaceCamera: null,
      observer: null,
      focusTarget: null,
    }),

    // Context assignment events:
    on: {
      ASSIGN_CANVAS: {
        actions: 'assignCanvas',
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
        ],
      },

      ASSIGN_THREE: {
        cond: (context, event) => {
          return context.getThree !== event.get;
        },
        actions: [
          assign({ getThree: (_, event) => event.get }),
          log('Assigning getThree!'),
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
        ],
      },
      ASSIGN_SURFACE_CAMERA: {
        cond: (context, event) => {
          return context.surfaceCamera !== event.camera;
        },
        actions: [
          assign({ surfaceCamera: (_, event) => event.camera }),
          log('Assigning surface camera!'),
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
            ],
          },
        },
      },
      surface: {
        entry: ['applySurfaceCamUp', 'setSurfaceCamDistance'],
        // Cleanup on exit:
        exit: ['cleanupSurfaceCam', log('exiting surface view')],
        on: {
          // UPDATE event:
          UPDATE: {
            internal: true,
            // Run action on self-transition.
            actions: [
              'updateSurfaceView',
              // 'applySurfaceCamUp'
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
      assignCanvas: assign({
        canvas: (context, event) => {
          // Only assign the canvas if the one in context is uninitialized.
          if (context.canvas) return context.canvas;
          return event.canvas;
        },
      }),
      assignControls: assign({
        controls: (_, event) => {
          event.controls.mouseButtons.right = 8; // Zoom on right mouse button
          return event.controls;
        },
      }),
      assignTarget: assign({
        // Set new focus target.
        focusTarget: (_, event) => {
          return event.focusTarget;
        },
      }),
      updateSpaceView: (context, event) => {
        const controls = context.controls;
        if (!controls) {
          console.error('camera controls are null');
          return;
        }
        const focusTarget = context.focusTarget;
        if (!focusTarget) return;

        // Get world position of focus target.
        focusTarget.getWorldPosition(_targetWorldPos);

        // Update controls to follow target.
        controls.moveTo(..._targetWorldPos.toArray(), false).catch((reason) => {
          console.log('error updating camera controls: ', reason);
        });

        // Force the controls to update the camera.
        controls.update(event.deltaTime);
      },
      updateSurfaceView: (context, event) => {
        const controls = context.controls;
        const observer = context.observer;
        if (!controls || !observer) return;
        observer.getWorldPosition(_observerWorldPos);
        // Update controls to follow target.
        controls
          .moveTo(..._observerWorldPos.toArray(), false)
          .catch((reason) => {
            console.log('error updating camera controls: ', reason);
          });
        // Force the controls to update the camera.
        controls.update(event.deltaTime);
      },
      cleanupSurfaceCam: (context) => {
        const { controls, surfaceCamera, observer } = context;
        if (!controls || !surfaceCamera || !observer) return;

        // Reset surface camera.
        observer.add(surfaceCamera);
        surfaceCamera.position.set(0, 0, 1e-3);
        surfaceCamera.rotation.set(0, 0, 0);
        surfaceCamera.updateProjectionMatrix();
      },
      applySurfaceCamUp: (context) => {
        const { controls, surfaceCamera, observer, focusTarget } = context;
        if (!controls || !surfaceCamera || !observer || !focusTarget) return;

        // !!!
        // NOTE: This works!
        observer.getWorldPosition(_observerWorldPos);
        focusTarget.getWorldPosition(_targetWorldPos);
        // Get direction from target center to observer in world coordinates.
        _observerUp.subVectors(_observerWorldPos, _targetWorldPos);
        _observerUp.normalize(); // Normalize the direction vector.
        // !!!

        surfaceCamera.up.copy(_observerUp);
        controls.applyCameraUp();
      },
      applySpaceCamUp: (context) => {
        // Reset up vector of camera.
        const { controls, spaceCamera } = context;
        if (!controls || !spaceCamera) return;
        spaceCamera.up.set(0, 1, 0);
        controls.applyCameraUp();
      },
      setSpaceCamDistance: (context) => {
        const { controls, focusTarget } = context;
        if (!controls) return;

        controls.maxDistance = 1e12;
        if (!focusTarget) {
          controls.minDistance = SUN_RADIUS / (10 * EARTH_RADIUS);
          return;
        }
        // Type guard.
        if (!(focusTarget instanceof KeplerBody)) {
          console.error('error! focusTarget is not a KeplerBody');
          return;
        }
        const body = context.focusTarget as KeplerBody; // Cast to KeplerBody.
        if (body && controls) {
          const radius = body.meanRadius / EARTH_RADIUS;
          const minDistance = 0.01 + radius;

          // Set min distance relative to focus targets radius.
          controls.minDistance = minDistance;
        }
      },
      setSurfaceCamDistance: (context) => {
        const { controls } = context;
        if (!controls) return;
        controls.minDistance = 1e-5;
        controls.maxDistance = 2e-5;
      },
    },
  }
);
