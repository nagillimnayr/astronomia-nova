import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import { fromZodError } from 'zod-validation-error';
import { ComputedPhysicalData } from '../types/ComputedEphemerides';
import {
  type ComputedEphemerides,
  ComputedEphemeridesSchema,
  ComputedPhysicalDataSchema,
  ComputedPhysicalData,
} from '../types/ComputedEphemerides';

export async function loadComputedEphemerides(
  name: string
): Promise<ComputedEphemerides> {
  // Get file path.
  const fileName = _.kebabCase(name + '-computed');

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

  const ephemerides: ComputedEphemerides = result.data;
  return ephemerides;
}

export async function loadComputedPhysicalData(
  name: string
): Promise<ComputedPhysicalData> {
  // Get file path.
  const fileName = _.kebabCase(name + '-computed-physical');

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

  const physicalData: ComputedPhysicalData = result.data;
  return physicalData;
}
