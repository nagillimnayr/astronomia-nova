import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import {
  type ComputedEphemerides,
  type ComputedPhysicalData,
} from '../types/ComputedEphemerides';

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

  // const { id, centerId, centerName, epoch } = ephemeris;

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
