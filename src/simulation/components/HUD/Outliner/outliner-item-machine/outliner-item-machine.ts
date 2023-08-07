import type KeplerBody from '@/simulation/classes/kepler-body';
import { createMachine } from 'xstate';

type Context = {
  body: KeplerBody;
};

type Events = { type: 'TOGGLE' } | { type: 'OPEN' } | { type: 'CLOSE' };

type PromiseService = { data: unknown };
type Services = {
  openSubtree: PromiseService;
  closeSubtree: PromiseService;
};

export const outlinerItemMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./outliner-item-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as Services,
    },

    id: 'outliner-item-machine',

    context: () => ({
      body: null!,
      subnodes: new Map<string, HTMLDivElement>(),
    }),

    initial: 'open',
    states: {
      opening: {
        invoke: {
          src: 'openSubtree',
          onDone: { target: 'open' },
        },
      },
      open: {
        on: {
          TOGGLE: {
            target: 'closing',
          },
          CLOSE: {
            target: 'closing',
          },
        },
      },
      closing: {
        invoke: {
          src: 'closeSubtree',
          onDone: { target: 'closed' },
        },
      },
      closed: {
        on: {
          TOGGLE: {
            cond: 'validateSubNodeCount',
            target: 'opening',
          },
          OPEN: {
            cond: 'validateSubNodeCount',
            target: 'opening',
          },
        },
      },
    },
  },
  {
    guards: {
      validateSubNodeCount: ({ body }) => body.orbitingBodies.length > 0,
    },
  }
);
