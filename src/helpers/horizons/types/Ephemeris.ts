import z from 'zod';
import { ElementTableSchema } from './ElementTable';
import { PhysicalDataSchema } from './PhysicalData';
import { VectorTableSchema } from './VectorTable';

export const EphemerisSchema = z.object({
  id: z.string(),
  name: z.string(),
  centerId: z.string(),
  centerName: z.string(),
  epoch: z.string(),
  ephemerisType: z.string(),
  table: z.union([ElementTableSchema, VectorTableSchema]),
});

export type Ephemeris = z.infer<typeof EphemerisSchema>;

export const EphemeridesSchema = z.object({
  id: z.string(),
  name: z.string(),
  centerId: z.string(),
  centerName: z.string(),
  epoch: z.string(),
  elementTable: ElementTableSchema,
  vectorTable: VectorTableSchema,
  physicalData: PhysicalDataSchema,
});

export type Ephemerides = z.infer<typeof EphemeridesSchema>;
