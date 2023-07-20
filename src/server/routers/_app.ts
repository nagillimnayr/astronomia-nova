import { z } from 'zod';
import { procedure, router } from '../trpc';
import { loadEphemerides } from '@/lib/horizons/loadEphemerides';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  // Load ephemerides procedure. (Query)
  // Takes a string 'name' as input.
  loadEphemerides: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return await loadEphemerides(input.name);
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
