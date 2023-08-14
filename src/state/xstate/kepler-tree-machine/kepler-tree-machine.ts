import { assign, createMachine, log } from 'xstate';
import type KeplerBody from '@/simulation/classes/kepler-body';
import { makeFixedUpdateFn } from '@/simulation/systems/FixedTimeStep';
import { traverseKeplerTree } from '@/simulation/systems/keplerTree';
import { TIME_MULT, UPDATES_PER_DAY } from '@/simulation/utils/constants';

const updateSimulation = makeFixedUpdateFn<KeplerBody>(
  (root: KeplerBody, timeStep: number) => {
    traverseKeplerTree(root, timeStep * TIME_MULT);
  },
  UPDATES_PER_DAY
);

type Context = {
  root: KeplerBody | null;
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
      }),
      updateSimulation: ({ root }, { deltaTime }) => {
        updateSimulation(root!, deltaTime);
      },
    },
  }
);
