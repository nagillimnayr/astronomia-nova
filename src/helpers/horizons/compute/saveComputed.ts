import {
  type ComputedEphemerides,
  type ComputedPhysicalData,
} from '@/helpers/horizons/types/ComputedEphemerides';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

export async function saveComputedEphemerides(
  ephemerides: ComputedEphemerides
) {
  const name = ephemerides.name;

  // create file path
  const fileName = _.kebabCase(name + '-computed');

  const pathToNewFile = path.resolve(
    'json',
    path.join('computed', 'ephemerides', `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  await fs.writeJSON(pathToNewFile, ephemerides);

  return { path: pathToNewFile };
}

export async function saveComputedPhysicalData(data: ComputedPhysicalData) {
  const name = data.name;

  const fileName = _.kebabCase(name + '-computed-physical');
  const pathToNewFile = path.resolve(
    'json',
    path.join('computed', 'physical-data', `${fileName}.json`)
  );

  await fs.writeJSON(pathToNewFile, data);

  return { path: pathToNewFile };
}
