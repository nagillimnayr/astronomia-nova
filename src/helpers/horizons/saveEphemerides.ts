import { type Ephemerides } from '@/helpers/horizons/types/Ephemerides';
import { type PhysicalData } from '@/helpers/horizons/types/PhysicalData';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';



export async function savePhysicalData(data: PhysicalData) {
  const name = data.name;

  const fileName = _.kebabCase(name + 'physical');
  const pathToNewFile = path.resolve(
    'json',
    path.join('horizons', 'physical-data', `${fileName}.json`)
  );

  await fs.writeJSON(pathToNewFile, data);

  return { path: pathToNewFile };
}

// Save set of ephemerides.
export async function saveEphemerides(ephemerides: Ephemerides) {
  const {  name } = ephemerides;

  // create file path
  const fileName = _.kebabCase(name);

  const jsonDirectory = path.join(process.cwd(), 'json');
  const pathToNewFile = path.resolve(
    jsonDirectory,
    path.join('horizons', 'ephemerides', `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  await fs.writeJSON(pathToNewFile, ephemerides);

  return { path: pathToNewFile };
}
