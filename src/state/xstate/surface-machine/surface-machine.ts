import { PI_OVER_TWO } from '@/simulation/utils/constants';
import { Object3D, Spherical, Vector3 } from 'three';
import { assign, createMachine, log } from 'xstate';

const _pos = new Vector3();
const _spherical = new Spherical();

const MIN_LATITUDE = -180;
const MAX_LATITUDE = 180;
const MIN_LONGITUDE = -90;
const MAX_LONGITUDE = 90;

type Context = {
  latitude: number;
  longitude: number;
};

type Events =
  // | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'SET_LATITUDE'; value: number }
  | { type: 'SET_LONGITUDE'; value: number }
  | { type: 'SET_COORDS_FROM_VECTOR'; pos: Vector3 };

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
      latitude: 0,
      longitude: 0,
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
      SET_COORDS_FROM_VECTOR: {
        actions: ['setCoordsFromVector'],
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
      // Expects the vector to be in local coordinates relative to the body.
      setCoordsFromVector: assign((_, { pos }) => {
        _spherical.setFromVector3(pos);
        _spherical.makeSafe();

        return {
          latitude: _spherical.theta,
          // Polar angle of spherical coordinates is measured from the pole, rather than the equator, so must be adjusted.
          longitude: _spherical.phi - PI_OVER_TWO,
        };
      }),
    },
    guards: {
      validateLatitude: ({ latitude }, { value }) => {
        return (
          latitude !== value && value >= MIN_LATITUDE && value <= MAX_LATITUDE
        );
      },
      validateLongitude: ({ longitude }, { value }) => {
        return (
          longitude !== value &&
          value >= MIN_LONGITUDE &&
          value <= MAX_LONGITUDE
        );
      },
    },
  }
);
