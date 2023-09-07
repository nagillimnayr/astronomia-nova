import { EventDispatcher } from 'three';
import { createMachine } from 'xstate';

type Context = {
  eventDispatcher: EventDispatcher;
};

type Events =
  | { type: 'ADD_LISTENER'; event: string; listener: () => void }
  | { type: 'REMOVE_LISTENER'; event: string; listener: () => void }
  | { type: 'DISPATCH'; event: string };

export const eventMachine = createMachine(
  {
    predictableActionArguments: true,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'event-machine',

    initial: 'idle',
    states: {
      idle: {},
    },
  },
  {
    actions: {},
  }
);
