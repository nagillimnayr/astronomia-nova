import { assign, createMachine, log } from 'xstate';
import type KeplerBody from '@/simulation/classes/kepler-body';
import { makeFixedUpdateFn } from '@/simulation/systems/FixedTimeStep';
import { traverseKeplerTree } from '@/simulation/systems/keplerTree';
import { DAY } from '@/simulation/utils/constants';

const updateSimulation = makeFixedUpdateFn<KeplerBody>(
  (root: KeplerBody, timeStep: number) => {
    traverseKeplerTree(root, timeStep * DAY);
  },
  60
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
