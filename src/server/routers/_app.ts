import { z } from 'zod';
import { procedure, router } from '../trpc';
import {
  loadEphemerides,
  loadPhysicalData,
} from '@/lib/horizons/loadEphemerides';
import { loadComputedEphemerides } from '@/lib/horizons/compute/loadComputed';
import { computePhysicalData } from '@/lib/horizons/compute/computeEphemerides';

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
      return await computePhysicalData(input.name);
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
