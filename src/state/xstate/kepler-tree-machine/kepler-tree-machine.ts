import { assign, createMachine, log } from 'xstate';
import KeplerBody from '@/simulation/classes/kepler-body';
import { makeFixedUpdateFn } from '@/simulation/systems/FixedTimeStep';
import { traverseKeplerTree } from '@/simulation/systems/keplerTree';
import { DAY } from '@/simulation/utils/constants';
import { EventDispatcher } from 'three';

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
        actions: ['assignRoot'],
      },
    },
  },
  {
    actions: {
      assignRoot: assign({
        root: (_, event) => event.root,
      }),
    },
  }
);
