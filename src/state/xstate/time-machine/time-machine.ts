/* eslint-disable @typescript-eslint/ban-ts-comment */
import { J2000 } from '@/constants/constants';
import { addSeconds } from 'date-fns';
import { assign, createMachine } from 'xstate';

const MIN_TIMESCALE = -100;
const MAX_TIMESCALE = 100;

export enum TimeUnit {
  Second,
  Minute,
  Hour,
  Day,
}

const TimeUnitMap: ReadonlyMap<TimeUnit, number> = new Map<TimeUnit, number>([
  [TimeUnit.Second, 1],
  [TimeUnit.Minute, 60],
  [TimeUnit.Hour, 3600],
  [TimeUnit.Day, 86400],
]);

type Context = {
  timeElapsed: number;
  previousTime: number;
  timescale: number;
  refDate: Date; // Reference date.
  date: Date;
  minTimescale: number;
  maxTimescale: number;
  timescaleUnit: TimeUnit;
};

type Events =
  | {
      type: 'UPDATE';
      deltaTime: number;
    }
  | { type: 'INCREMENT_TIMESCALE' }
  | { type: 'DECREMENT_TIMESCALE' }
  | { type: 'SET_TIMESCALE'; timescale: number }
  | { type: 'SET_TIMESCALE_UNIT'; timescaleUnit: number }
  | { type: 'INCREMENT_TIMESCALE_UNIT' }
  | { type: 'DECREMENT_TIMESCALE_UNIT' }
  | { type: 'PAUSE' }
  | { type: 'UNPAUSE' }
  | { type: 'ADVANCE_TIME'; deltaTime: number }; // Advances time by a specific amount, no time scaling.

export const timeMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./time-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'time-machine',

    context: () => ({
      timeElapsed: 0,
      timescale: 1,
      refDate: J2000,
      date: J2000,
      minTimescale: MIN_TIMESCALE,
      maxTimescale: MAX_TIMESCALE,
      timescaleUnit: TimeUnit.Second,
    }),

    on: {
      INCREMENT_TIMESCALE: {
        cond: ({ timescale, maxTimescale }) => timescale < maxTimescale,
        actions: ['incrementTimescale'],
      },
      DECREMENT_TIMESCALE: {
        cond: ({ timescale, minTimescale }) => timescale > minTimescale,
        actions: ['decrementTimescale'],
      },
      SET_TIMESCALE: {
        cond: { type: 'validateTimescale' },
        actions: ['setTimescale'],
      },
      SET_TIMESCALE_UNIT: {
        actions: ['setTimescaleUnit'],
      },
      INCREMENT_TIMESCALE_UNIT: {
        actions: ['incrementTimescaleUnit'],
      },
      DECREMENT_TIMESCALE_UNIT: {
        actions: ['decrementTimescaleUnit'],
      },
      ADVANCE_TIME: {
        actions: ['advanceTime', 'updateDate'],
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
      setTimescaleUnit: assign({
        timescaleUnit: (_, event) => event.timescaleUnit,
      }),
      incrementTimescaleUnit: assign({
        timescaleUnit: ({ timescaleUnit }, event) => {
          const index = (timescaleUnit + 1) % 4;
          const key = TimeUnit[index];
          /** @ts-ignore */
          return key ? (TimeUnit[key] as TimeUnit) : timescaleUnit;
        },
      }),
      decrementTimescaleUnit: assign({
        timescaleUnit: ({ timescaleUnit }, event) => {
          const index = (timescaleUnit - 1) % 4;
          const key = TimeUnit[index];
          /** @ts-ignore */
          return key ? (TimeUnit[key] as TimeUnit) : timescaleUnit;
        },
      }),

      updateTime: assign({
        timeElapsed: (
          { timeElapsed, timescale, timescaleUnit },
          { deltaTime }
        ) => {
          const scaledDelta =
            deltaTime * timescale * TimeUnitMap.get(timescaleUnit)!;
          return timeElapsed + scaledDelta;
        },
      }),

      // Computes the current date based on the timeElapsed relative to the
      // start date (refDate).
      updateDate: assign({
        date: ({ refDate, timeElapsed }) => {
          return addSeconds(refDate, timeElapsed);
        },
      }),
      // Update time without scaling.
      advanceTime: assign({
        timeElapsed: ({ timeElapsed }, { deltaTime }) => {
          return timeElapsed + deltaTime;
        },
      }),

      // logEvent: log((_, event) => event),
      logEvent: () => {
        return;
      },
      // logTimer: log((context) => context.timeElapsed),
    },
    guards: {
      validateTimescale: (
        { minTimescale, maxTimescale, ...context },
        event
      ) => {
        return (
          context.timescale !== event.timescale &&
          event.timescale >= minTimescale &&
          event.timescale <= maxTimescale
        );
      },
    },
  }
);
