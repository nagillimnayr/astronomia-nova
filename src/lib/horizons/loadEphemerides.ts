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
