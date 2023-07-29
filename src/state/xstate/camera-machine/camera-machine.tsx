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

type Context = {
  canvas: HTMLCanvasElement; // Reference to the canvas element.
  scene: Scene | null;
  spaceControls: CameraControls;
  surfaceControls: PointerLockControls | null;
  spaceCamera: PerspectiveCamera | null;
  surfaceCamera: PerspectiveCamera | null;
  focus: Object3D | null;
};

type Events =
  | { type: 'TO_SURFACE' }
  | { type: 'TO_SPACE' }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ASSIGN_CANVAS'; canvas: HTMLCanvasElement }
  | { type: 'ASSIGN_SCENE'; scene: Scene }
  | { type: 'ASSIGN_SPACE_CONTROLS'; controls: CameraControls }
  | { type: 'ASSIGN_SURFACE_CONTROLS'; controls: PointerLockControls }
  | { type: 'ASSIGN_SPACE_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_SURFACE_CAMERA'; camera: PerspectiveCamera }
  | { type: 'FOCUS'; focus: Object3D | null };

// Capture the vector in a closure.
const targetWorldPos = new Vector3();

export const cameraMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./camera-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },

    // Initial context.
    context: () => ({
      canvas: null!,
      spaceControls: null!,
      surfaceControls: null,
      scene: null,
      spaceCamera: null,
      surfaceCamera: null,
      focus: null,
    }),

    // Context assignment events:
    on: {
      ASSIGN_CANVAS: {
        actions: 'assignCanvas',
      },
      ASSIGN_SPACE_CONTROLS: {
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
        actions: [
          assign({
            surfaceControls: (_, event) => event.controls,
          }),
          () => console.log('Assigning surfaceControls!'),
        ],
      },
      ASSIGN_SCENE: {
        actions: [
          assign({ scene: (_, event) => event.scene }),
          () => console.log('Assigning scene!'),
        ],
      },
      ASSIGN_SPACE_CAMERA: {
        actions: [
          assign({ spaceCamera: (_, event) => event.camera }),
          () => console.log('Assigning space camera!'),
        ],
      },
      ASSIGN_SURFACE_CAMERA: {
        actions: [
          assign({ surfaceCamera: (_, event) => event.camera }),
          () => console.log('Assigning surface camera!'),
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
      },
    },
  }
);
