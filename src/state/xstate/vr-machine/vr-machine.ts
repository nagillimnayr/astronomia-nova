import { XRController } from '@react-three/xr';
import { Group } from 'three';
import { assign, createMachine } from 'xstate';

type Context = {
  player: Group | null;
  leftController: XRController | null;
  rightController: XRController | null;
};

type Events =
  | { type: 'START_SESSION' }
  | { type: 'END_SESSION' }
  | { type: 'ASSIGN_PLAYER'; player: Group }
  | { type: 'ASSIGN_LEFT_CONTROLLER'; controller: XRController }
  | { type: 'ASSIGN_RIGHT_CONTROLLER'; controller: XRController };

export const vrMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./vr-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'vr-machine',
    context: {
      player: null,
      leftController: null,
      rightController: null,
    },

    on: {
      ASSIGN_PLAYER: {
        cond: (context, event) => {
          return context.player !== event.player;
        },
        actions: ['assignPlayer'],
      },
      ASSIGN_LEFT_CONTROLLER: {
        cond: (context, event) => {
          return context.leftController !== event.controller;
        },
        actions: ['assignLeftController'],
      },
      ASSIGN_RIGHT_CONTROLLER: {
        cond: (context, event) => {
          return context.rightController !== event.controller;
        },
        actions: ['assignRightController'],
      },
    },
  },

  {
    actions: {
      assignPlayer: assign({
        player: (_, { player }) => player,
      }),
      assignLeftController: assign({
        leftController: (_, { controller }) => controller,
      }),
      assignRightController: assign({
        rightController: (_, { controller }) => controller,
      }),
    },
  }
);
