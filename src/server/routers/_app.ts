import {
  loadComputedEphemerides,
  loadComputedPhysicalData,
} from '@/helpers/horizons/compute/loadComputed';
import {
  loadEphemerides,
  loadPhysicalData,
} from '@/helpers/horizons/loadEphemerides';
import { z } from 'zod';
import { procedure, router } from '../trpc';
import {
  ComputedEphemerides,
  ComputedPhysicalData,
} from '@/helpers/horizons/types/ComputedEphemerides';

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

  loadComputedEphemerides: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return await loadComputedEphemerides(input.name);
    }),

  loadComputedPhysicalData: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return await loadComputedPhysicalData(input.name);
    }),

  loadAllComputedData: procedure.query(async () => {
    // The promises don't rely on the fulfillment of each other, so we don't need to await each one before starting the next.
    const promises = [
      loadComputedPhysicalData('Sun'), // 0
      loadComputedEphemerides('Mercury'), // 1
      loadComputedEphemerides('Venus'), // 2
      loadComputedEphemerides('Earth'), // 3
      loadComputedEphemerides('Moon'), // 4
      loadComputedEphemerides('Mars'), // 5
      loadComputedEphemerides('Jupiter'), // 6
      loadComputedEphemerides('Saturn'), // 7
      loadComputedEphemerides('Uranus'), // 8
      loadComputedEphemerides('Neptune'), // 9
    ];

    const data = await Promise.all(promises);
    return {
      sun: data[0] as ComputedPhysicalData,
      mercury: data[1] as ComputedEphemerides,
      venus: data[2] as ComputedEphemerides,
      earth: data[3] as ComputedEphemerides,
      moon: data[4] as ComputedEphemerides,
      mars: data[5] as ComputedEphemerides,
      jupiter: data[6] as ComputedEphemerides,
      saturn: data[7] as ComputedEphemerides,
      uranus: data[8] as ComputedEphemerides,
      neptune: data[9] as ComputedEphemerides,
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
