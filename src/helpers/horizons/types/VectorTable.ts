import z from 'zod';

export const Vector3TupleSchema = z.tuple([z.number(), z.number(), z.number()]);

export const VectorTableSchema = z.object({
  position: Vector3TupleSchema,
  velocity: Vector3TupleSchema,
  range: z.number(),
  rangeRate: z.number(),
});

export type VectorTable = z.infer<typeof VectorTableSchema>;
