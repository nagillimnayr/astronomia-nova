import { assign, createMachine, log } from 'xstate';
import type KeplerBody from '@/components/canvas/body/kepler-body';
import { makeFixedUpdateFn } from '@/helpers/fixed-time-step';
import { traverseKeplerTree } from '@/helpers/kepler-tree';
import { TIME_MULT, UPDATES_PER_REAL_SECOND } from '@/constants/constants';

type Context = {
  root: KeplerBody | null;
  fixedUpdate: (deltaTime: number) => void;
};

type Events =
  | { type: 'ASSIGN_ROOT'; root: KeplerBody }
  | { type: 'UPDATE_TREE' }
  | { type: 'UPDATE'; deltaTime: number };

export const keplerTreeMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./kepler-tree-machine.typegen').Typegen0,

    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'kepler-tree-machine',

    context: () => ({
      root: null,
      fixedUpdate: null!,
    }),

    on: {
      ASSIGN_ROOT: {
        cond: (context, event) => {
          return context.root !== event.root;
        },
        actions: ['assignRoot', log((_, event) => event)],
      },
      UPDATE: {
        cond: (context) => (context.root ? true : false),
        actions: ['updateSimulation'],
      },
    },

    initial: 'idle',
    states: {
      idle: {
        on: {
          UPDATE_TREE: {
            target: 'updatingTree',
          },
        },
      },
      updatingTree: {
        // This is just so that components can subscribe to the event.
        on: {
          UPDATE_TREE: {
            target: 'idle',
          },
        },
      },
    },
  },
  {
    actions: {
      assignRoot: assign({
        root: (_, event) => event.root,
        fixedUpdate: (_, event) =>
          makeFixedUpdateFn((timeStep: number) => {
            traverseKeplerTree(event.root, timeStep * TIME_MULT);
          }, UPDATES_PER_REAL_SECOND),
      }),
      updateSimulation: ({ fixedUpdate, root }, { deltaTime }) => {
        if (!fixedUpdate || !root) return;
        fixedUpdate(deltaTime);
      },
    },
  }
);
