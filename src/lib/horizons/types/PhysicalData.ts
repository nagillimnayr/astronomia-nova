import z from 'zod';

export const PhysicalDataSchema = z.object({
  meanRadius: z.number(),
  mass: z.number(),
  // siderealRotPeriod: z.number(),
  siderealRotRate: z.number(), // (rad/s)
  gravParameter: z.number(),
  obliquity: z.number(), // axial tilt (deg)
});

// infer type from schema
export type PhysicalData = z.infer<typeof PhysicalDataSchema>;
