import {
  type Ephemerides,
  EphemeridesSchema,
  type Ephemeris,
  EphemerisSchema,
} from '@/helpers/horizons/types/Ephemeris';
import {
  type PhysicalData,
  PhysicalDataSchema,
} from '@/helpers/horizons/types/PhysicalData';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import { fromZodError } from 'zod-validation-error';

export async function loadEphemerides(name: string) {
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

  const ephemerides: Ephemerides = result.data;
  return ephemerides;
}

export async function loadEphemeris(
  name: string,
  type: 'ELEMENTS' | 'VECTORS'
): Promise<Ephemeris> {
  // Create file path.
  const fileName = _.kebabCase(name + '-' + type);
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
