import { type Ephemeris } from '@/helpers/horizons/types/Ephemeris';
import { type PhysicalData } from '@/helpers/horizons/types/PhysicalData';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

// Save individual ephemeris table.
export async function saveEphemeris(ephemeris: Ephemeris) {
  const name = ephemeris.name;
  const type = ephemeris.ephemerisType;
  // Create file path.
  const fileName = _.kebabCase(name + type);

  const pathToNewFile = path.resolve(
    'json',
    path.join('horizons', _.toLower(type), `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  await fs.writeJSON(pathToNewFile, ephemeris);

  return { path: pathToNewFile };
}

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

type Ephemerides = {
  elements: Ephemeris;
  vectors: Ephemeris;
  physicalData: PhysicalData;
};

// Save set of ephemerides.
export async function saveEphemerides(ephemerides: Ephemerides) {
  const { elements, vectors, physicalData } = ephemerides;
  // Check to make sure that tables are for the same body.
  if (
    elements.name !== vectors.name ||
    elements.id !== vectors.id ||
    elements.epoch !== vectors.epoch
  ) {
    throw new Error('error: ephemerides do not match');
  }

  await saveEphemeris(elements);
  await saveEphemeris(vectors);
  await savePhysicalData(physicalData);

  const { id, name, centerId, centerName, epoch } = elements;

  // Create file path.
  const fileName = _.kebabCase(name);

  const jsonDirectory = path.join(process.cwd(), 'json');
  const pathToNewFile = path.resolve(
    jsonDirectory,
    path.join('horizons', 'ephemerides', `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  const data = {
    id,
    name,
    centerId,
    centerName,
    epoch,
    physicalData,
    elementTable: elements.table,
    vectorTable: vectors.table,
  };

  await fs.writeJSON(pathToNewFile, data);

  return { path: pathToNewFile };
}
