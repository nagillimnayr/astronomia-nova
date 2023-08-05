import { assign, createMachine, log } from 'xstate';

type Context = {};
type Events = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'TOGGLE' };

export const dialogMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./dialog-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'dialog-machine',

    context: () => ({}),

    initial: 'closed',
    states: {
      open: {
        on: {
          CLOSE: {
            target: 'closed',
            actions: ['logEvent'],
          },
          TOGGLE: {
            target: 'closed',
            actions: ['logEvent'],
          },
        },
      },
      closed: {
        on: {
          OPEN: {
            target: 'open',
            actions: ['logEvent'],
          },
          TOGGLE: {
            target: 'open',
            actions: ['logEvent'],
          },
        },
      },
    },
  },
  {
    actions: {
      logEvent: log((_, event) => event),
    },
  }
);
