import {
  type Ephemerides,
  EphemeridesSchema,
} from '@/helpers/horizons/types/Ephemerides';
import {
  type PhysicalData,
  PhysicalDataSchema,
} from '@/helpers/horizons/types/PhysicalData';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import { fromZodError } from 'zod-validation-error';

export async function loadEphemerides(name: string): Promise<Ephemerides> {
  // Create file path.
  const fileName = _.kebabCase(name);

  const jsonDirectory = path.join(process.cwd(), 'json');

  const pathToFile = path.resolve(
    jsonDirectory,
    path.join('horizons', 'ephemerides', `${fileName}.json`)
  );

  // Read and parse JSON file.
  const result = await EphemeridesSchema.safeParseAsync(
    (await fs.readJSON(pathToFile)) as unknown
  );

  // Throw error if parse was not successful.
  if (!result.success) {
    const validationError = fromZodError(result.error);
    console.log(validationError);
    throw new Error(validationError.toString());
  }

  return result.data;
}


export async function loadPhysicalData(name: string): Promise<PhysicalData> {
  // Create file path.
  const fileName = _.kebabCase(name + '-physical');
  const jsonDirectory = path.join(process.cwd(), 'json');

  const pathToFile = path.resolve(
    jsonDirectory,
    path.join('horizons', 'physical-data', `${fileName}.json`)
  );

  // Read and parse JSON file.
  const result = await PhysicalDataSchema.safeParseAsync(
    (await fs.readJSON(pathToFile)) as unknown
  );

  // Throw error if parse was not successful.
  if (!result.success) {
    const validationError = fromZodError(result.error);
    console.log(validationError);
    throw new Error(validationError.toString());
  }

  return result.data;
}
