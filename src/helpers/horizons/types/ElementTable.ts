import z from 'zod';

export const ElementTableSchema = z.object({
  eccentricity: z.number(),
  periapsis: z.number(),
  inclination: z.number(),
  longitudeOfAscendingNode: z.number(),
  argumentOfPeriapsis: z.number(),
  timeOfPeriapsis: z.number(),
  meanMotion: z.number(),
  meanAnomaly: z.number(),
  trueAnomaly: z.number(),
  semiMajorAxis: z.number(),
  apoapsis: z.number(),
  siderealOrbitPeriod: z.number(),

  // Additional elements which must be computed, as they are not provided by Horizons.
  semiMinorAxis: z.number(),
  semiLatusRectum: z.number(),
  linearEccentricity: z.number(),
});

export type ElementTable = z.infer<typeof ElementTableSchema>;
