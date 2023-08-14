import { TIME_MULT, J2000 } from '@/simulation/utils/constants';
import { addSeconds } from 'date-fns';
import { assign, createMachine, log, sendParent, sendTo } from 'xstate';

const MIN_TIMESCALE = -100;
const MAX_TIMESCALE = 100;

type Context = {
  timeElapsed: number;
  previousTime: number;
  timescale: number;
  refDate: Date; // Reference date.
  date: Date;
};

type Events =
  | {
      type: 'UPDATE';
      deltaTime: number;
    }
  | { type: 'INCREMENT_TIMESCALE' }
  | { type: 'DECREMENT_TIMESCALE' }
  | { type: 'SET_TIMESCALE'; timescale: number }
  | { type: 'PAUSE' }
  | { type: 'UNPAUSE' };

export const timeMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./time-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'time-machine',

    context: {
      timeElapsed: 0,
      previousTime: 0,
      timescale: 1,
      refDate: J2000,
      date: J2000,
    },

    on: {
      INCREMENT_TIMESCALE: { actions: ['incrementTimescale'] },
      DECREMENT_TIMESCALE: { actions: ['decrementTimescale'] },
      SET_TIMESCALE: {
        cond: { type: 'validateTimescale' },
        actions: ['setTimescale'],
      },
    },

    initial: 'paused',
    states: {
      paused: {
        on: {
          UNPAUSE: {
            target: 'unpaused',
            actions: ['logEvent'],
          },
        },
      },
      unpaused: {
        on: {
          UPDATE: {
            actions: ['updateTime', 'updateDate'],
          },
          PAUSE: {
            target: 'paused',
            actions: ['logEvent'],
          },
        },
      },
    },
  },
  {
    actions: {
      incrementTimescale: assign({
        timescale: ({ timescale }) => timescale + 1,
      }),
      decrementTimescale: assign({
        timescale: ({ timescale }) => timescale - 1,
      }),
      setTimescale: assign({
        timescale: (_, { timescale }) => timescale,
      }),

      updateTime: assign({
        timeElapsed: ({ timeElapsed, timescale }, { deltaTime }) => {
          const scaledDelta = deltaTime * timescale;
          return timeElapsed + scaledDelta;
        },
        previousTime: ({ timeElapsed }) => timeElapsed, // Update previous time.
      }),

      // Computes the current date based on the timeElapsed relative to the start date (refDate).
      updateDate: assign({
        date: ({ refDate, timeElapsed }) => {
          return addSeconds(refDate, timeElapsed * TIME_MULT);
        },
      }),

      logEvent: log((_, event) => event),
      // logTimer: log((context) => context.timeElapsed),
    },
    guards: {
      validateTimescale: (context, { timescale }) => {
        return (
          context.timescale !== timescale &&
          timescale >= MIN_TIMESCALE &&
          timescale <= MAX_TIMESCALE
        );
      },
    },
  }
);
