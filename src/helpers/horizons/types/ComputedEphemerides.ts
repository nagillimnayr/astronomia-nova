import z from 'zod';
import { ElementTableSchema } from './ElementTable';
import { PhysicalDataTableSchema } from './PhysicalData';
import { Vector3TupleSchema } from './VectorTable';

const IdSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const EphemerisIdSchema = IdSchema.extend({
  centerId: z.string(),
  centerName: z.string(),
  epoch: z.string(),
});

// Additional elements which must be computed, as they are not provided by
// Horizons.
export const ComputedElementTableSchema = ElementTableSchema.extend({
  semiMinorAxis: z.number(),
  semiLatusRectum: z.number(),
  linearEccentricity: z.number(),
});

// Horizons' vector tables cause issues, so the initial orbital state vectors
// must be re-computed from the orbital elements.
export const ComputedVectorTableSchema = z.object({
  initialPosition: Vector3TupleSchema,
  initialVelocity: Vector3TupleSchema,
});

// Merge element and vector table.
export const ComputedEphemerisTableSchema = ComputedElementTableSchema.merge(
  ComputedVectorTableSchema
);

export const ComputedPhysicalDataTableSchema = PhysicalDataTableSchema.extend({
  siderealRotationPeriod: z.number(),
});

export const ComputedPhysicalDataSchema = IdSchema.extend({
  table: ComputedPhysicalDataTableSchema,
});
export const ComputedEphemeridesSchema = EphemerisIdSchema.extend({
  ephemerisTable: ComputedEphemerisTableSchema,
  physicalDataTable: ComputedPhysicalDataTableSchema,
});

export type ComputedElementTable = z.infer<typeof ComputedElementTableSchema>;
export type ComputedVectorTable = z.infer<typeof ComputedVectorTableSchema>;
export type ComputedEphemerisTable = z.infer<
  typeof ComputedEphemerisTableSchema
>;
export type ComputedPhysicalDataTable = z.infer<
  typeof ComputedPhysicalDataTableSchema
>;

export type ComputedEphemerides = z.infer<typeof ComputedEphemeridesSchema>;
export type ComputedPhysicalData = z.infer<typeof ComputedPhysicalDataSchema>;
