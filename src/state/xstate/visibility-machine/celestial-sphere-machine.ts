import { type ActorRefFrom, assign, createMachine, log, spawn } from 'xstate';
import { opacityMachine } from './opacity-machine';

type Context = {
  constellations: ActorRefFrom<typeof opacityMachine>;
  celestialGrid: ActorRefFrom<typeof opacityMachine>;
};

type Events =
  | { type: 'SET_CONSTELLATION_OPACITY'; opacity: number }
  | { type: 'SET_GRID_OPACITY'; opacity: number };

export const celestialSphereMachine = createMachine({
  predictableActionArguments: true,
  tsTypes: {} as import('./celestial-sphere-machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },

  id: 'celestial-sphere-machine',

  context: {
    constellations: null!,
    celestialGrid: null!,
  },

  entry: [
    // log('celestialSphereMachine entry'),
    // Spawn child actors.
    assign({
      constellations: () =>
        spawn(opacityMachine, { name: 'constellations', sync: true }),
      celestialGrid: () =>
        spawn(opacityMachine, { name: 'celestialGrid', sync: true }),
    }),
  ],

  // exit: log('celestialSphereMachine exit'),
});
