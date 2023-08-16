import {
  type ActorRefFrom,
  assign,
  createMachine,
  log,
  send,
  sendTo,
  spawn,
} from 'xstate';
import { toggleMachine } from '../toggle-machine/toggle-machine';

type Context = {
  trajectories: ActorRefFrom<typeof toggleMachine>;
  annotations: ActorRefFrom<typeof toggleMachine>;
  markers: ActorRefFrom<typeof toggleMachine>;
  velocityArrows: ActorRefFrom<typeof toggleMachine>;
  polarAxes: ActorRefFrom<typeof toggleMachine>;
  equinoxes: ActorRefFrom<typeof toggleMachine>;
};

type Events =
  | { type: 'TOGGLE'; target: string }
  | { type: 'ENABLE'; target: string }
  | { type: 'DISABLE'; target: string };

export const visibilityMachine = createMachine({
  predictableActionArguments: true,
  tsTypes: {} as import('./visibility-machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'visibility-machine',

  context: {
    trajectories: null!,
    annotations: null!,
    markers: null!,
    velocityArrows: null!,
    polarAxes: null!,
    equinoxes: null!,
  },

  entry: [
    log('visibilityMachine entry'),
    // Spawn child actors.
    assign({
      trajectories: () =>
        spawn(toggleMachine, { name: 'trajectories', sync: true }),
      annotations: () =>
        spawn(toggleMachine, { name: 'annotations', sync: true }),
      markers: () => spawn(toggleMachine, { name: 'markers', sync: true }),
      velocityArrows: () =>
        spawn(toggleMachine, { name: 'velocityArrows', sync: true }),
      polarAxes: () => spawn(toggleMachine, { name: 'polarAxes', sync: true }),
      equinoxes: () => spawn(toggleMachine, { name: 'equinoxes', sync: true }),
    }),
  ],

  on: {
    // Forward the event to target state.
    TOGGLE: {
      actions: [(_, event) => sendTo(event.target, { type: event.type })],
    },
    ENABLE: {
      actions: [(_, event) => sendTo(event.target, { type: event.type })],
    },
    DISABLE: {
      actions: [(_, event) => sendTo(event.target, { type: event.type })],
    },
  },
});
