import {
  loadEphemerides,
  loadPhysicalData,
} from '@/helpers/horizons/loadEphemerides';
import { z } from 'zod';
import { procedure, router } from '../trpc';
import { type PhysicalData } from '@/helpers/horizons/types/PhysicalData';
import { type Ephemerides } from '@/helpers/horizons/types/Ephemerides';

export const appRouter = router({
  // Load ephemerides procedure. (Query)
  // Takes a string 'name' as input.
  loadEphemerides: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return await loadEphemerides(input.name);
    }),

  loadPhysicalData: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return await loadPhysicalData(input.name);
    }),

  loadAllEphemerides: procedure.query(async () => {
    // The promises don't rely on the fulfillment of each other, so we don't need to await each one before starting the next.
    const promises = [
      loadPhysicalData('Sun'), // 0
      loadEphemerides('Mercury'), // 1
      loadEphemerides('Venus'), // 2
      loadEphemerides('Earth'), // 3
      loadEphemerides('Moon'), // 4
      loadEphemerides('Mars'), // 5
      loadEphemerides('Jupiter'), // 6
      loadEphemerides('Saturn'), // 7
      loadEphemerides('Uranus'), // 8
      loadEphemerides('Neptune'), // 9
    ];

    const data = await Promise.all(promises);
    return {
      sun: data[0] as PhysicalData,
      mercury: data[1] as Ephemerides,
      venus: data[2] as Ephemerides,
      earth: data[3] as Ephemerides,
      moon: data[4] as Ephemerides,
      mars: data[5] as Ephemerides,
      jupiter: data[6] as Ephemerides,
      saturn: data[7] as Ephemerides,
      uranus: data[8] as Ephemerides,
      neptune: data[9] as Ephemerides,
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
