import { assign, createMachine, log } from 'xstate';

type Context = {};
type Events = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'TOGGLE' };

type PromiseService = { data: unknown };
type Services = {
  openDialog: PromiseService;
  closeDialog: PromiseService;
};

export const dialogMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./dialog-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as Services,
    },
    id: 'dialog-machine',

    context: () => ({}),

    initial: 'closed',
    states: {
      opening: {
        invoke: {
          src: 'openDialog',
          onDone: { target: 'open' },
        },
      },
      open: {
        on: {
          CLOSE: {
            target: 'closing',
            actions: ['logEvent'],
          },
          TOGGLE: {
            target: 'closing',
            actions: ['logEvent'],
          },
        },
      },
      closing: {
        invoke: {
          src: 'closeDialog',
          onDone: { target: 'closed' },
        },
      },
      closed: {
        on: {
          OPEN: {
            target: 'opening',
            actions: ['logEvent'],
          },
          TOGGLE: {
            target: 'opening',
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
    services: {
      openDialog: () => {
        return new Promise((resolve) => resolve(null));
      },
      closeDialog: () => {
        return new Promise((resolve) => resolve(null));
      },
    },
  }
);
