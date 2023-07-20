import z from 'zod';

const Vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const VectorTableSchema = z.object({
  position: Vector3Schema,
  velocity: Vector3Schema,
  range: z.number(),
  rangeRate: z.number(),
});

export type VectorTable = z.infer<typeof VectorTableSchema>;
