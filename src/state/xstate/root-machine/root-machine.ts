import {
  ActorRef,
  ActorRefFrom,
  assign,
  createMachine,
  forwardTo,
  log,
  send,
  sendTo,
  spawn,
} from 'xstate';
import { cameraMachine } from '../camera-machine/camera-machine';
import { selectionMachine } from '../selection-machine/selection-machine';
import { visibilityMachine } from '../visibility-machine/visibility-machine';
import { timeMachine } from '../time-machine/time-machine';
import { keplerTreeMachine } from '../kepler-tree-machine/kepler-tree-machine';
import { celestialSphereMachine } from '../visibility-machine/celestial-sphere-machine';

type Context = {
  timeActor: ActorRefFrom<typeof timeMachine>;
  keplerTreeActor: ActorRefFrom<typeof keplerTreeMachine>;
  celestialSphereActor: ActorRefFrom<typeof celestialSphereMachine>;
};

type Events = { type: 'UPDATE'; deltaTime: number } | { type: 'LOG_CHILDREN' };

export const rootMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./root-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'root-machine',

    context: {
      timeActor: null!,
      keplerTreeActor: null!,
      celestialSphereActor: null!,
    },

    entry: [
      assign({
        timeActor: () =>
          spawn(timeMachine, {
            name: 'time',
            sync: true,
          }),
        keplerTreeActor: () =>
          spawn(keplerTreeMachine, {
            name: 'keplerTree',
            sync: true,
          }),
        celestialSphereActor: () =>
          spawn(celestialSphereMachine, {
            name: 'celestialSphereActor',
            sync: true,
          }),
      }),
    ],

    on: {
      UPDATE: {
        cond: (context) => {
          const timeActor = context.timeActor.getSnapshot()!;
          return timeActor.matches('unpaused');
        },
        actions: ['updateTimeActor', 'updateKeplerTreeActor'],
      },
      LOG_CHILDREN: {
        actions: ['logTimeActor', 'logKeplerTreeActor', 'logEvent'],
      },
    },
  },
  {
    actions: {
      updateTimeActor: send(
        (context, { deltaTime }) => ({ type: 'UPDATE', deltaTime }),
        { to: (context) => context.timeActor }
      ),
      updateKeplerTreeActor: send(
        (context, { deltaTime }) => {
          // Scale deltaTime and send it to keplerTreeActor.
          const timeActor = context.timeActor.getSnapshot()!;
          const scaledDelta = deltaTime * timeActor.context.timescale;
          return {
            type: 'UPDATE',
            deltaTime: scaledDelta,
          };
        },
        { to: (context) => context.keplerTreeActor }
      ),

      logTimeActor: log((context) => context.timeActor),
      logKeplerTreeActor: log((context) => context.keplerTreeActor),
      logEvent: log((_, event) => event),
    },
  }
);
