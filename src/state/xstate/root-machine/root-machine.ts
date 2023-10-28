import { KeplerBody } from '@/components/canvas/body/kepler-body';
import { TIME_MULT } from '@/constants/constants';
import { type ActorRefFrom, assign, createMachine, log, spawn } from 'xstate';
import { sendTo } from 'xstate/lib/actions';
import { cameraMachine } from '../camera-machine/camera-machine';
import { keplerTreeMachine } from '../kepler-tree-machine/kepler-tree-machine';
import { mapMachine } from '../map-machine/map-machine';
import { selectionMachine } from '../selection-machine/selection-machine';
import { surfaceMachine } from '../surface-machine/surface-machine';
import { timeMachine } from '../time-machine/time-machine';
import { uiMachine } from '../ui-machine/ui-machine';
import { celestialSphereMachine } from '../visibility-machine/celestial-sphere-machine';
import { visibilityMachine } from '../visibility-machine/visibility-machine';
import { vrMachine } from '../vr-machine/vr-machine';

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
  | { type: 'ADVANCE_DAY'; reverse?: boolean }
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
        actions: [
          'updateTimeActor',
          // 'updateKeplerTreeActor'
        ],
      },
      ADVANCE_TIME: {
        actions: [
          'advanceTimeActor',
          // 'advanceKeplerTreeActor'
        ],
      },
      ADVANCE_DAY: {
        cond: ({ cameraActor }) => {
          const { focusTarget } = cameraActor.getSnapshot()!.context;
          return focusTarget instanceof KeplerBody;
        },
        actions: [
          sendTo(({ timeActor }) => timeActor, { type: 'PAUSE' }),
          'advanceDay',
        ],
      },
      LOG_CHILDREN: {
        actions: ['logTimeActor', 'logKeplerTreeActor', 'logEvent'],
      },
    },
  },
  {
    actions: {
      updateTimeActor: sendTo(
        ({ timeActor }) => timeActor,
        (_, { deltaTime }) => ({ type: 'UPDATE', deltaTime })
      ),
      // updateKeplerTreeActor: sendTo(
      //   ({ keplerTreeActor }) => keplerTreeActor,
      //   (context, { deltaTime }) => {
      //     // Scale deltaTime and send it to keplerTreeActor.
      //     const timeActor = context.timeActor.getSnapshot()!;
      //     const scaledDelta = deltaTime * timeActor.context.timescale;
      //     return {
      //       type: 'UPDATE',
      //       deltaTime: scaledDelta,
      //     };
      //   }
      // ),

      advanceTimeActor: sendTo(
        ({ timeActor }) => timeActor,
        (_, event) => event
      ),

      // advanceKeplerTreeActor: sendTo(
      //   ({ keplerTreeActor }) => keplerTreeActor,
      //   (context, { deltaTime }) => ({
      //     type: 'UPDATE',
      //     deltaTime: deltaTime / TIME_MULT, // Since deltaTime is already in
      //     // seconds, it must be divided by
      //     // TIME_MULT, as it will be
      //     // multiplied by TIME_MULT when
      //     // passed to the update function.
      //   })
      // ),
      advanceDay: (context, { reverse }) => {
        const { cameraActor, keplerTreeActor, timeActor } = context;
        const { focusTarget } = cameraActor.getSnapshot()!.context;
        if (!(focusTarget instanceof KeplerBody)) return;
        let deltaTime = focusTarget.siderealRotationPeriod;

        reverse && (deltaTime *= -1);

        timeActor.send({ type: 'ADVANCE_TIME', deltaTime });

        deltaTime /= TIME_MULT; // Since deltaTime is already in seconds, it
        // must be divided by TIME_MULT, as it will be
        // multiplied by TIME_MULT when passed to the
        // update function.
        // keplerTreeActor.send({ type: 'UPDATE', deltaTime });
      },
      logTimeActor: log((context) => context.timeActor),
      logKeplerTreeActor: log((context) => context.keplerTreeActor),
      logEvent: log((_, event) => event),
    },
  }
);
