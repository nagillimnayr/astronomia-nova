import { Object3D, Vector3 } from 'three';
import { assign, createMachine, log } from 'xstate';

const _observerWorldPos = new Vector3();
const _observerUp = new Vector3();

type Context = {
  // observer: Object3D | null;
  latitude: number;
  longitude: number;
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};

type Events =
  // | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'SET_LATITUDE'; value: number }
  | { type: 'SET_LONGITUDE'; value: number };

export const surfaceMachine = createMachine(
  {
    predictableActionArguments: true,
    tsTypes: {} as import('./surface-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'surface-machine',

    // Initial context:
    context: () => ({
      observer: null,
      latitude: 0,
      longitude: 0,
      minLatitude: -180,
      maxLatitude: 180,
      minLongitude: -90,
      maxLongitude: 90,
    }),

    on: {
      SET_LATITUDE: {
        cond: 'validateLatitude',
        actions: ['setLatitude'],
      },
      SET_LONGITUDE: {
        cond: 'validateLongitude',
        actions: ['setLongitude'],
      },
    },
  },
  {
    actions: {
      // logEvent: log((_, event) => event),
      // assignObserver: assign({
      //   observer: (_, { observer }) => observer,
      // }),
      setLatitude: assign({
        latitude: (_, { value }) => value,
      }),
      setLongitude: assign({
        longitude: (_, { value }) => value,
      }),
    },
    guards: {
      validateLatitude: ({ latitude, minLatitude, maxLatitude }, { value }) => {
        return (
          latitude !== value && value >= minLatitude && value <= maxLatitude
        );
      },
      validateLongitude: (
        { longitude, minLongitude, maxLongitude },
        { value }
      ) => {
        return (
          longitude !== value && value >= minLongitude && value <= maxLongitude
        );
      },
    },
  }
);
