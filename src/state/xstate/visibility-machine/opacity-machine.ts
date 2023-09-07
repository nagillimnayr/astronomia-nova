import { assign, createMachine } from 'xstate';

type Context = {
  opacity: number;
};

type Events = { type: 'SET_OPACITY'; opacity: number };

export const opacityMachine = createMachine({
  predictableActionArguments: true,
  tsTypes: {} as import('./opacity-machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'opacity-machine',

  context: {
    opacity: 0,
  },

  // entry: log('opacity machine entry'),
  // exit: log('opacity machine exit'),

  on: {
    SET_OPACITY: {
      cond: (_, { opacity }) => opacity >= 0 && opacity <= 1,
      actions: [
        assign({
          opacity: (_, { opacity }) => opacity,
        }),
      ],
    },
  },
});
