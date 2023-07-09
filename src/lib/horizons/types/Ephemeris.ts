import z from 'zod';
import { ElementTableSchema } from './ElementTable';
import { VectorTableSchema } from './VectorTable';

export const EphemerisSchema = z.object({
  id: z.string(),
  name: z.string(),
  epoch: z.string(),
  ephemerisType: z.string(),
  table: z.union([ElementTableSchema, VectorTableSchema]),
});

export type Ephemeris = z.infer<typeof EphemerisSchema>;
