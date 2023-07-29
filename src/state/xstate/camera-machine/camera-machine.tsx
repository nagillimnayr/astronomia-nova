import { assign, createMachine, log } from 'xstate';
import { Object3D, Vector3, type PerspectiveCamera, type Scene } from 'three';
import { type CameraControls } from '@react-three/drei';
import type KeplerBody from '@/simulation/classes/kepler-body';
import { EARTH_RADIUS } from '@/simulation/utils/constants';
import { type RootState } from '@react-three/fiber';
import { degToRad } from 'three/src/math/MathUtils';

const _targetWorldPos = new Vector3();
const _observerWorldPos = new Vector3();
const _observerFwd = new Vector3();
const _observerUp = new Vector3();
const _obj = new Object3D();

type Context = {
  canvas: HTMLCanvasElement; // Reference to the canvas element.
  getThree: (() => RootState) | null;
  controls: CameraControls | null;
  spaceCamera: PerspectiveCamera | null;
  surfaceCamera: PerspectiveCamera | null;
  focus: Object3D | null;
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
  | { type: 'FOCUS'; focus: Object3D | null };

export const cameraMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./camera-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'camera',
    // Initial context.
    context: () => ({
      canvas: null!,
      controls: null,
      getThree: null,
      spaceCamera: null,
      surfaceCamera: null,
      observer: null,
      focus: null,
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
          assign({
            controls: (_, event) => {
              event.controls.mouseButtons.right = 8; // Zoom on right mouse button
              return event.controls;
            },
          }),
          log('Assigning camera controls!'),
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
          // console.log(context.observer?.uuid, event.observer?.uuid);
          return context.observer !== event.observer;
        },
        actions: [
          assign({ observer: (_, event) => event.observer }),
          () => console.log('Assigning observer!'),
          'cleanupSurfaceCam',
        ],
      },
      FOCUS: {
        actions: ['assignFocus', log('FOCUS:')],
      },
    },

    initial: 'space', // Start in 'space' view-mode.

    states: {
      space: {
        entry: ['applySpaceCamUp'],
        // Cleanup on exit:
        exit: (context) => {
          const { spaceCamera, observer } = context;
          if (!spaceCamera || !observer) return;
        },
        on: {
          // UPDATE event.
          UPDATE: {
            // Run action on self-transition.
            actions: 'updateSpaceView',
          },
          TO_SURFACE: {
            // Transition to 'surface' view-mode:
            target: 'surface',

            actions: [log('TO_SURFACE')],
          },
        },
      },
      surface: {
        entry: [
          'applySurfaceCamUp',
          (context) => {
            const { controls } = context;
            // console.log('polar angle:', controls?.polarAngle);
            // console.log('azimuthal angle:', controls?.azimuthAngle);
            // controls?.rotatePolarTo(0, false).catch((reason) => {
            //   console.error(reason);
            // });
            // controls?.rotateAzimuthTo(0, false).catch((reason) => {
            //   console.error(reason);
            // });
            // console.log('polar angle:', controls?.polarAngle);
            // console.log('azimuthal angle:', controls?.azimuthAngle);
            // controls?.update(1);
          },
        ],
        // Cleanup on exit:
        exit: 'cleanupSurfaceCam',
        on: {
          // UPDATE event:
          UPDATE: {
            // Run action on self-transition.
            actions: [
              'updateSurfaceView',
              // 'applySurfaceCamUp'
            ],
          },
          TO_SPACE: {
            // Transition to 'space' view-mode:
            target: 'space',
            actions: [log('TO_SPACE')],
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
      assignFocus: assign({
        // Set new focus target.
        focus: (context, event) => {
          const body = event.focus as KeplerBody;
          if (body && context.controls) {
            // Set min distance relative to focus targets radius.
            context.controls.minDistance =
              0.01 + body.meanRadius / EARTH_RADIUS;
          }
          return event.focus;
        },
      }),
      updateSpaceView: (context, event) => {
        const controls = context.controls;
        if (!controls) {
          console.error('camera controls are null');
          return;
        }
        const focus = context.focus;
        if (!focus) return;

        // Get world position of focus target.
        focus.getWorldPosition(_targetWorldPos);

        // Update controls to follow target.
        controls.moveTo(..._targetWorldPos.toArray(), false).catch((reason) => {
          console.log('error updating camera controls: ', reason);
        });

        // Force the controls to update the camera.
        controls.update(event.deltaTime);
      },
      updateSurfaceView: (context, event) => {
        // Todo
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
        const { surfaceCamera, observer } = context;
        if (!surfaceCamera || !observer) return;

        // Reset surface camera.
        observer.add(surfaceCamera);
        surfaceCamera.position.set(0, 0, -1e-3);
        surfaceCamera.rotation.set(0, 0, 0);
        surfaceCamera.updateProjectionMatrix();
      },
      applySurfaceCamUp: (context) => {
        const { controls, surfaceCamera, observer, focus } = context;
        if (!controls || !surfaceCamera || !observer || !focus) return;

        // !!!
        // NOTE: This works!
        observer.getWorldPosition(_observerWorldPos);
        focus.getWorldPosition(_targetWorldPos);
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
    },
  }
);
