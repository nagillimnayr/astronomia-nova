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
import { timeMachine } from '../time-machine/time-machine';
import { keplerTreeMachine } from '../kepler-tree-machine/kepler-tree-machine';

type Context = {
  timeActor: ActorRefFrom<typeof timeMachine>;
  keplerTreeActor: ActorRefFrom<typeof keplerTreeMachine>;
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
    timeActor: null!,
    keplerTreeActor: null!,
  },

  entry: [
    assign({
      timeActor: () =>
        spawn(timeMachine, {
          name: 'time',
          sync: true,
        }),
      keplerTreeActor: () =>
        spawn(keplerTreeMachine, {
          name: 'keplerTree',
          sync: true,
        }),
    }),
  ],
});
