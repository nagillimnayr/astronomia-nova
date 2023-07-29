import { assign, createMachine } from 'xstate';
import {
  type Object3D,
  Vector3,
  type PerspectiveCamera,
  type Scene,
} from 'three';
import { type CameraControls } from '@react-three/drei';
import type KeplerBody from '@/simulation/classes/kepler-body';
import { EARTH_RADIUS } from '@/simulation/utils/constants';
import { type PointerLockControls } from 'three-stdlib';
import { type RootState } from '@react-three/fiber';

const targetWorldPos = new Vector3();
const observerWorldPos = new Vector3();

type Context = {
  canvas: HTMLCanvasElement; // Reference to the canvas element.
  getThree: (() => RootState) | null;
  spaceControls: CameraControls;
  surfaceControls: CameraControls | null;
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
  | { type: 'ASSIGN_SPACE_CONTROLS'; controls: CameraControls }
  | { type: 'ASSIGN_SURFACE_CONTROLS'; controls: CameraControls }
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
      spaceControls: null!,
      surfaceControls: null,
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
      ASSIGN_SPACE_CONTROLS: {
        cond: (context, event) => {
          return context.spaceControls !== event.controls;
        },
        actions: [
          assign({
            spaceControls: (_, event) => {
              event.controls.mouseButtons.right = 8; // Zoom on right mouse button
              return event.controls;
            },
          }),
          () => console.log('Assigning spaceControls!'),
        ],
      },
      ASSIGN_SURFACE_CONTROLS: {
        cond: (context, event) => {
          return context.surfaceControls !== event.controls;
        },
        actions: [
          assign({
            surfaceControls: (_, event) => event.controls,
          }),
          () => console.log('Assigning surfaceControls!'),
        ],
      },
      ASSIGN_THREE: {
        cond: (context, event) => {
          return context.getThree !== event.get;
        },
        actions: [
          assign({ getThree: (_, event) => event.get }),
          () => console.log('Assigning scene!'),
        ],
      },
      ASSIGN_SPACE_CAMERA: {
        cond: (context, event) => {
          return context.spaceCamera !== event.camera;
        },
        actions: [
          assign({ spaceCamera: (_, event) => event.camera }),
          () => console.log('Assigning space camera!'),
        ],
      },
      ASSIGN_SURFACE_CAMERA: {
        cond: (context, event) => {
          return context.surfaceCamera !== event.camera;
        },
        actions: [
          assign({ surfaceCamera: (_, event) => event.camera }),
          () => console.log('Assigning surface camera!'),
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
          // (context, event) => {
          //   const camera = context.surfaceCamera;
          //   const observer = context.observer;
          //   if (!camera || !observer) return;
          //   observer.add(camera);
          // },
        ],
      },
      FOCUS: {
        actions: 'assignFocus',
      },
    },

    initial: 'space', // Start in 'space' view-mode.

    states: {
      space: {
        on: {
          // UPDATE event.
          UPDATE: {
            // Run action on self-transition.
            actions: 'updateSpaceView',
          },
          TO_SURFACE: {
            // Transition to 'surface' view-mode.
            target: 'surface',
            // actions: ['toSurface'],
          },
        },
      },
      surface: {
        on: {
          // UPDATE event.
          UPDATE: {
            // Run action on self-transition.
            actions: 'updateSurfaceView',
          },
          TO_SPACE: {
            // Transition to 'space' view-mode.
            target: 'space',
            // actions: ['toSpace'],
          },
        },
      },
    },
  },
  {
    // Action implementations.
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
          context.spaceControls.minDistance =
            0.01 + body.meanRadius / EARTH_RADIUS;
          return event.focus;
        },
      }),
      updateSpaceView: (context, event) => {
        const controls = context.spaceControls;
        if (!controls) {
          console.error('camera controls are null');
          return;
        }
        const focus = context.focus;
        if (!focus) return;

        // Get world position of focus target.
        focus.getWorldPosition(targetWorldPos);

        // Update controls to follow target.
        controls.moveTo(...targetWorldPos.toArray(), false).catch((reason) => {
          console.log('error updating camera controls: ', reason);
        });

        // Force the controls to update the camera.
        controls.update(event.deltaTime);
      },
      updateSurfaceView: (context, event) => {
        // Todo
        const controls = context.surfaceControls;
        const observer = context.observer;
        if (!controls || !observer) return;
        observer.getWorldPosition(observerWorldPos);
        // Update controls to follow target.
        controls
          .moveTo(...observerWorldPos.toArray(), false)
          .catch((reason) => {
            console.log('error updating camera controls: ', reason);
          });
        // Force the controls to update the camera.
        controls.update(event.deltaTime);
      },
      // toSurface: (context, event) => {
      //   if (!context.getThree) return;
      //   const state = context.getThree();

      // },
      // toSpace: (context, event) => {},
    },
  }
);
