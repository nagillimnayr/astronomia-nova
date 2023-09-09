import z from 'zod';

export const PhysicalDataTableSchema = z.object({
  meanRadius: z.number(),
  mass: z.number(),
  siderealRotationRate: z.number(), // (rad/s)
  gravParameter: z.number(),
  obliquity: z.number(), // axial tilt (deg)
});

export const PhysicalDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  table: PhysicalDataTableSchema,
});

// infer type from schema
export type PhysicalDataTable = z.infer<typeof PhysicalDataTableSchema>;
export type PhysicalData = z.infer<typeof PhysicalDataSchema>;
