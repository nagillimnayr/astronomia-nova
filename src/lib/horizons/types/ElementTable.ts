import z from 'zod';

export const ElementTableSchema = z.object({
  name: z.string(),
  date: z.string(),
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
});

export type ElementTable = z.infer<typeof ElementTableSchema>;
