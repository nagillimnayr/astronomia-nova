import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';

import { type ElementTable } from './types/ElementTable';
import { type VectorTable } from './types/VectorTable';
import { type Ephemeris } from './types/Ephemeris';
import { type PhysicalData } from './types/PhysicalData';

// Save individual ephemeris table.
export async function saveEphemeris(ephemeris: Ephemeris) {
  const name = ephemeris.name;
  const date = ephemeris.epoch;
  const type = ephemeris.ephemerisType;
  // create file path
  const fileName = _.kebabCase(name + type);
  const __filename = fileURLToPath(import.meta.url);

  let directory = '';
  if (type === 'ELEMENTS') {
    directory = 'element-tables';
  } else if (type === 'VECTORS') {
    directory = 'vector-tables';
  } else {
    throw new Error('invalid type');
  }
  const pathToNewFile = path.resolve(
    'json',
    path.join('horizons', directory, `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  // const { id, centerId, centerName, epoch } = ephemeris;

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

  console.log(saveEphemeris(elements));
  console.log(saveEphemeris(vectors));
  console.log(savePhysicalData(physicalData));

  const { id, name, centerId, centerName, epoch } = elements;

  // create file path
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
