import {
  type ComputedEphemerides,
  ComputedEphemeridesSchema,
  type ComputedPhysicalData,
  ComputedPhysicalDataSchema,
} from '@/helpers/horizons/types/ComputedEphemerides';
import fs from 'fs-extra';
import { kebabCase } from 'lodash';
import path from 'path';
import { fromZodError } from 'zod-validation-error';

export async function loadComputedEphemerides(
  name: string
): Promise<ComputedEphemerides> {
  // Get file path.
  const fileName = kebabCase(name + '-computed');

  const jsonDirectory = path.join(process.cwd(), 'json');

  const pathToFile = path.resolve(
    jsonDirectory,
    path.join('computed', 'ephemerides', `${fileName}.json`)
  );

  const result = await ComputedEphemeridesSchema.safeParseAsync(
    await fs.readJSON(pathToFile)
  );

  // Throw error if parse was not successful.
  if (!result.success) {
    const validationError = fromZodError(result.error);
    console.log(validationError);
    throw new Error(validationError.toString());
  }

  return result.data;
}

export async function loadComputedPhysicalData(
  name: string
): Promise<ComputedPhysicalData> {
  // Get file path.
  const fileName = kebabCase(name + '-computed-physical');

  const jsonDirectory = path.join(process.cwd(), 'json');

  const pathToFile = path.resolve(
    jsonDirectory,
    path.join('computed', 'physical-data', `${fileName}.json`)
  );

  const result = await ComputedPhysicalDataSchema.safeParseAsync(
    await fs.readJSON(pathToFile)
  );

  // Throw error if parse was not successful.
  if (!result.success) {
    const validationError = fromZodError(result.error);
    console.log(validationError);
    throw new Error(validationError.toString());
  }

  return result.data;
}
