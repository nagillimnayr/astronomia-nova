import KeplerBody from '@/simulation/classes/kepler-body';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import { assign, createMachine, log } from 'xstate';

type Context = {
  bodyMap: Map<string, KeplerBody>;
  orbitMap: Map<string, KeplerOrbit>;
};

type Events =
  | { type: 'ADD_BODY'; body: KeplerBody }
  | { type: 'ADD_ORBIT'; orbit: KeplerOrbit }
  | { type: 'REMOVE_BODY'; name: string }
  | { type: 'REMOVE_ORBIT'; name: string }
  | { type: 'REMOVE'; name: string };

export const mapMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./map-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'map-machine',

    context: () => ({
      bodyMap: new Map<string, KeplerBody>(),
      orbitMap: new Map<string, KeplerOrbit>(),
    }),

    // entry: log('map-machine entry'),

    on: {
      ADD_BODY: {
        cond: 'validateAddBody',
        actions: ['addBody', log((_, event) => event)],
      },
      ADD_ORBIT: {
        cond: 'validateAddOrbit',
        actions: ['addOrbit', log((_, event) => event)],
      },
      REMOVE_BODY: {
        cond: 'validateRemoveBody',
        actions: ['removeBody', log((_, event) => event)],
      },
      REMOVE_ORBIT: {
        cond: 'validateRemoveOrbit',
        actions: ['removeOrbit', log((_, event) => event)],
      },
      REMOVE: {
        cond: 'validateRemoveBody',
        actions: ['removeBody', 'removeOrbit', log((_, event) => event)],
      },
    },
  },
  {
    // Construct a new map each time so that the changes will trigger re-renders.
    actions: {
      addBody: assign({
        bodyMap: ({ bodyMap }, { body }) =>
          new Map(bodyMap.set(body.name, body)),
      }),
      addOrbit: assign({
        orbitMap: ({ orbitMap }, { orbit }) =>
          new Map(orbitMap.set(orbit.name, orbit)),
      }),
      removeBody: assign({
        bodyMap: ({ bodyMap }, { name }) => {
          bodyMap.delete(name);
          return new Map(bodyMap);
        },
      }),
      removeOrbit: assign({
        orbitMap: ({ orbitMap }, { name }) => {
          orbitMap.delete(name);
          return new Map(orbitMap);
        },
      }),
    },
    guards: {
      validateAddBody: (context, event) =>
        !context.bodyMap.has(event.body.name),
      validateAddOrbit: (context, event) =>
        !context.orbitMap.has(event.orbit.name),
      validateRemoveBody: (context, event) => context.bodyMap.has(event.name),
      validateRemoveOrbit: (context, event) => context.orbitMap.has(event.name),
    },
  }
);
