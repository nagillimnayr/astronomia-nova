import { assign, createMachine, log, send, sendTo } from 'xstate';
import { toggleMachine } from '../toggle-machine/toggle-machine';

type Context = {};

type Events =
  | { type: 'TOGGLE'; target: string }
  | { type: 'ENABLE'; target: string }
  | { type: 'DISABLE'; target: string };

export const visibilityMachine = createMachine({
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'visibility',

  on: {
    // Forward the event to target state.
    TOGGLE: {
      actions: [(context, event) => sendTo(event.target, { type: event.type })],
    },
  },

  invoke: [
    {
      id: 'trajectories',
      src: toggleMachine,
    },
    {
      id: 'annotations',
      src: toggleMachine,
    },
    {
      id: 'markers',
      src: toggleMachine,
    },
    {
      id: 'velocity-arrows',
      src: toggleMachine,
    },
  ],
});
