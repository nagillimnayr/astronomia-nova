import { assign, createMachine } from 'xstate';
import { type Object3D, Vector3 } from 'three';
import { type CameraControls } from '@react-three/drei';
import { type MutableRefObject } from 'react';

type Context = {
  canvas: HTMLCanvasElement; // Reference to the canvas element.
  controls: CameraControls;
  focus: Object3D | null;
};

type Events =
  | { type: 'TO_SURFACE' }
  | { type: 'TO_SPACE' }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ASSIGN_CANVAS'; canvas: HTMLCanvasElement }
  | { type: 'ASSIGN_CONTROLS'; controls: CameraControls }
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

    // Initial context (Initialized dynamically by the parameters of the factory function).
    context: () => ({
      canvas: null!,
      controls: null!,
      focus: null,
    }),

    // Context assignment events.
    on: {
      ASSIGN_CANVAS: {
        actions: 'assignCanvas',
      },
      ASSIGN_CONTROLS: {
        actions: 'assignControls',
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
      assignControls: assign({
        controls: (_, event) => {
          event.controls.mouseButtons.right = 8; // Zoom on right mouse button
          return event.controls;
        },
      }),
      assignFocus: assign({
        // Set new focus target.
        focus: (_, event) => event.focus,
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
