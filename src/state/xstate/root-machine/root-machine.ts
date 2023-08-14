import {
  type ActorRefFrom,
  assign,
  createMachine,
  log,
  send,
  spawn,
} from 'xstate';
import { cameraMachine } from '../camera-machine/camera-machine';
import { selectionMachine } from '../selection-machine/selection-machine';
import { visibilityMachine } from '../visibility-machine/visibility-machine';
import { timeMachine } from '../time-machine/time-machine';
import { keplerTreeMachine } from '../kepler-tree-machine/kepler-tree-machine';
import { celestialSphereMachine } from '../visibility-machine/celestial-sphere-machine';
import { mapMachine } from '../map-machine/map-machine';
import { surfaceMachine } from '../surface-machine/surface-machine';
import { uiMachine } from '../ui-machine/ui-machine';
import { vrMachine } from '../vr-machine/vr-machine';
import { sendTo } from 'xstate/lib/actions';

type Context = {
  timeActor: ActorRefFrom<typeof timeMachine>;
  keplerTreeActor: ActorRefFrom<typeof keplerTreeMachine>;
  selectionActor: ActorRefFrom<typeof selectionMachine>;
  cameraActor: ActorRefFrom<typeof cameraMachine>;
  uiActor: ActorRefFrom<typeof uiMachine>;
  visibilityActor: ActorRefFrom<typeof visibilityMachine>;
  celestialSphereActor: ActorRefFrom<typeof celestialSphereMachine>;
  mapActor: ActorRefFrom<typeof mapMachine>;
  surfaceActor: ActorRefFrom<typeof surfaceMachine>;
  vrActor: ActorRefFrom<typeof vrMachine>;
};

type Events =
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ADVANCE_TIME'; deltaTime: number }
  | { type: 'LOG_CHILDREN' };

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
      selectionActor: null!,
      cameraActor: null!,
      uiActor: null!,
      visibilityActor: null!,
      celestialSphereActor: null!,
      mapActor: null!,
      surfaceActor: null!,
      vrActor: null!,
    },

    entry: [
      assign({
        timeActor: () =>
          spawn(timeMachine, {
            name: 'timeActor',
            sync: true,
          }),
        keplerTreeActor: () =>
          spawn(keplerTreeMachine, {
            name: 'keplerTreeActor',
            sync: true,
          }),

        selectionActor: () =>
          spawn(selectionMachine, {
            name: 'selectionActor',
            sync: true,
          }),
        cameraActor: () =>
          spawn(cameraMachine, {
            name: 'cameraActor',
            sync: true,
          }),
        uiActor: () =>
          spawn(uiMachine, {
            name: 'uiActor',
            sync: true,
          }),
        visibilityActor: () =>
          spawn(visibilityMachine, {
            name: 'visibilityActor',
            sync: true,
          }),

        celestialSphereActor: () =>
          spawn(celestialSphereMachine, {
            name: 'celestialSphereActor',
            sync: true,
          }),
        mapActor: () =>
          spawn(mapMachine, {
            name: 'mapActor',
            sync: true,
          }),
        surfaceActor: () =>
          spawn(surfaceMachine, {
            name: 'surfaceActor',
            sync: true,
          }),
        vrActor: () =>
          spawn(vrMachine, {
            name: 'vrActor',
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
      ADVANCE_TIME: {
        actions: ['advanceTimeActor', 'updateKeplerTreeActor'],
      },
      LOG_CHILDREN: {
        actions: ['logTimeActor', 'logKeplerTreeActor', 'logEvent'],
      },
    },
  },
  {
    actions: {
      updateTimeActor: send(
        (_, { deltaTime }) => ({ type: 'UPDATE', deltaTime }),
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
      advanceTimeActor: sendTo(
        ({ timeActor }) => timeActor,
        (_, event) => event
      ),

      logTimeActor: log((context) => context.timeActor),
      logKeplerTreeActor: log((context) => context.keplerTreeActor),
      logEvent: log((_, event) => event),
    },
  }
);
