import { gsap } from 'gsap';
import { type MutableRefObject } from 'react';
import { assign, createMachine, log } from 'xstate';

type Context = {
  dialogRef: MutableRefObject<HTMLDivElement | null> | null;
};
type Events =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SET_REF'; ref: MutableRefObject<HTMLDivElement | null> };

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

    context: () => ({
      dialogRef: null,
    }),

    on: {
      SET_REF: {
        cond: ({ dialogRef }, { ref }) => dialogRef !== ref,
        actions: [
          assign({
            dialogRef: (_, { ref }) => ref,
          }),
          // 'logEvent',
        ],
      },
    },

    initial: 'closed',
    states: {
      opening: {
        invoke: {
          src: 'openDialog',
          onDone: {
            target: 'open',
            // actions: ['logEvent']
          },
        },
        on: {
          CLOSE: {
            target: 'closing',
            // actions: ['logEvent'],
          },
        },
      },
      open: {
        on: {
          CLOSE: {
            target: 'closing',
            // actions: ['logEvent'],
          },
          TOGGLE: {
            target: 'closing',
            // actions: ['logEvent'],
          },
        },
      },
      closing: {
        invoke: {
          src: 'closeDialog',
          onDone: {
            target: 'closed',
            // actions: ['logEvent']
          },
        },
        on: {
          OPEN: {
            target: 'opening',
            // actions: ['logEvent'],
          },
        },
      },
      closed: {
        on: {
          OPEN: {
            target: 'opening',
            // actions: ['logEvent'],
          },
          TOGGLE: {
            target: 'opening',
            // actions: ['logEvent'],
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
      openDialog: (context) => {
        return new Promise((resolve) => {
          const { dialogRef } = context;
          if (!dialogRef || !dialogRef.current) return resolve(null);
          const dialogDiv = dialogRef.current;
          gsap.to(dialogDiv, {
            duration: 0.3,
            opacity: '100%',
            ease: 'power2.in',
            onComplete: resolve,
          });
        });
      },
      closeDialog: (context) => {
        return new Promise((resolve) => {
          const { dialogRef } = context;
          if (!dialogRef || !dialogRef.current) {
            return resolve(null);
          }
          const dialogDiv = dialogRef.current;
          gsap.to(dialogDiv, {
            duration: 0.3,
            opacity: 0,
            ease: 'power2.out',
            onComplete: resolve,
          });
        });
      },
    },
  }
);
