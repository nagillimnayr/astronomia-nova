import z from 'zod';
import { ElementTableSchema } from './ElementTable';
import { PhysicalDataSchema, PhysicalDataTableSchema } from './PhysicalData';

export const EphemerisSchema = z.object({
  id: z.string(),
  name: z.string(),
  centerId: z.string(),
  centerName: z.string(),
  epoch: z.string(),
  ephemerisType: z.string(),
  table: ElementTableSchema,
});

export type Ephemeris = z.infer<typeof EphemerisSchema>;

export const EphemeridesSchema = z.object({
  id: z.string(),
  name: z.string(),
  centerId: z.string(),
  centerName: z.string(),
  epoch: z.string(),
  elementTable: ElementTableSchema,
  physicalDataTable: PhysicalDataTableSchema,
});

export type Ephemerides = z.infer<typeof EphemeridesSchema>;
