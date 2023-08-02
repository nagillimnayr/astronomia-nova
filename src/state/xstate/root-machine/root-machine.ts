import {
  ActorRef,
  ActorRefFrom,
  assign,
  createMachine,
  log,
  spawn,
} from 'xstate';
import { cameraMachine } from '../camera-machine/camera-machine';
import { selectionMachine } from '../selection-machine/selection-machine';
import { visibilityMachine } from '../visibility-machine/visibility-machine';

type Context = {
  visibilityActor: ActorRefFrom<typeof visibilityMachine>;
};

type Events = { type: 'UPDATE'; deltaTime: number };

export const rootMachine = createMachine({
  predictableActionArguments: true,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  id: 'root-machine',

  context: {
    visibilityActor: null!,
  },

  entry: [
    assign({
      visibilityActor: spawn(visibilityMachine, {
        name: 'visibility',
        sync: true,
      }),
    }),
  ],
});
