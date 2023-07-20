import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import { type BodyKey } from './BodyKey';
import { fromZodError } from 'zod-validation-error';

import { type Ephemerides, EphemeridesSchema } from './types/Ephemeris';

export async function loadEphemerides(name: string) {
  // create file path
  const fileName = _.kebabCase(name);
  const __filename = fileURLToPath(import.meta.url);
  console.log('__fileName:', __filename);
  const __dirname = path.dirname(__filename);
  console.log('__dirname:', __dirname);
  const pathToFile = path.resolve(
    __dirname,
    path.join('ephemerides', `${fileName}.json`)
  );

  // Read and parse JSON file.
  const result = await EphemeridesSchema.safeParseAsync(
    await fs.readJSON(pathToFile)
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
