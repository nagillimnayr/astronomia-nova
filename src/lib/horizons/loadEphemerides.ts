import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import { type BodyKey } from './BodyKey';
import { fromZodError } from 'zod-validation-error';

import {
  type Ephemerides,
  EphemeridesSchema,
  EphemerisSchema,
  Ephemeris,
} from './types/Ephemeris';
import { PhysicalData, PhysicalDataSchema } from './types/PhysicalData';

export async function loadEphemerides(name: string) {
  // create file path
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

  const ephemerides: Ephemerides = result.data;
  return ephemerides;
}

export async function loadEphemeris(
  name: string,
  type: 'ELEMENTS' | 'VECTORS'
) {
  // Create file path.
  const fileName = _.kebabCase(name + type);
  const jsonDirectory = path.join(process.cwd(), 'json');

  const pathToFile = path.resolve(
    jsonDirectory,
    path.join('horizons', _.toLower(type), `${fileName}.json`)
  );

  // Read and parse JSON file.
  const result = await EphemerisSchema.safeParseAsync(
    (await fs.readJSON(pathToFile)) as unknown
  );

  // Throw error if parse was not successful.
  if (!result.success) {
    const validationError = fromZodError(result.error);
    console.log(validationError);
    throw new Error(validationError.toString());
  }

  const ephemeris: Ephemeris = result.data;
  return ephemeris;
}

export async function loadPhysicalData(name: string) {
  // Create file path.
  const fileName = _.kebabCase(name + 'physical');
  const jsonDirectory = path.join(process.cwd(), 'json');

  const pathToFile = path.resolve(
    jsonDirectory,
    path.join('horizons', 'physical', `${fileName}.json`)
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

  const physicalData: PhysicalData = result.data;
  return physicalData;
}
