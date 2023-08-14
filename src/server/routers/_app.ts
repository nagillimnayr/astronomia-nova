import { z } from 'zod';
import { procedure, router } from '../trpc';
import {
  loadEphemerides,
  loadPhysicalData,
} from '@/lib/horizons/loadEphemerides';
import { loadComputedEphemerides } from '@/lib/horizons/compute/loadComputed';

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
});
// export type definition of API
export type AppRouter = typeof appRouter;
