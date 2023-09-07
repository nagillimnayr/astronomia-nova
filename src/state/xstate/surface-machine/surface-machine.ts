import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MIN_LATITUDE,
  MIN_LONGITUDE,
  RADS_TO_DEG,
} from '@/constants/constants';
import { Spherical, Vector3 } from 'three';
import { assign, createMachine } from 'xstate';

const _pos = new Vector3();
const _spherical = new Spherical();

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
        actions: ['logEvent', 'setCoordsFromVector'],
      },
    },
  },
  {
    actions: {
      // logEvent: log((_, event) => event),
      logEvent: () => {
        return;
      },

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

        let latitude = _spherical.phi * RADS_TO_DEG;
        let longitude = _spherical.theta * RADS_TO_DEG;

        // Adjust angles.
        latitude -= 90; // Equator should be at 0.
        latitude *= -1; // Flip so north pole is +90, south pole is -90.

        longitude -= 90; // Adjust so in line with local x axis of body.
        while (longitude > MAX_LONGITUDE) {
          longitude -= 360;
        }
        while (longitude < MIN_LONGITUDE) {
          longitude += 360;
        }

        return {
          latitude,
          longitude,
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
