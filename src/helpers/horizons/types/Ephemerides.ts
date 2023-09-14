import z from 'zod';
import { ElementTableSchema } from './ElementTable';
import {  PhysicalDataTableSchema } from './PhysicalData';
import { VectorTableSchema } from './VectorTable';



export const EphemeridesSchema = z.object({
  id: z.string(),
  name: z.string(),
  centerId: z.string(),
  centerName: z.string(),
  epoch: z.string(),
  elementTable: ElementTableSchema,
  vectorTable: VectorTableSchema,
  physicalDataTable: PhysicalDataTableSchema,
});

export type Ephemerides = z.infer<typeof EphemeridesSchema>;
