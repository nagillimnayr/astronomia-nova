import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';

import { type ElementTable } from './types/ElementTable';
import { type VectorTable } from './types/VectorTable';
import { type Ephemeris } from './types/Ephemeris';
import { PhysicalData } from './types/PhysicalData';

export function saveElementTable(elementTable: ElementTable) {
  //
}

export function saveVectorTable(vectorTable: VectorTable) {
  //
}

// Save individual ephemeris table.
export async function saveEphemeris(ephemeris: Ephemeris) {
  const name = ephemeris.name;
  const date = ephemeris.epoch;
  const type = ephemeris.ephemerisType;
  // create file path
  const fileName = _.kebabCase(name + type);
  const __filename = fileURLToPath(import.meta.url);
  console.log('__fileName:', __filename);
  const __dirname = path.dirname(__filename);
  console.log('__dirname:', __dirname);
  const pathToNewFile = path.resolve(
    __dirname,
    path.join('ephemerides', `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  await fs.writeJSON(pathToNewFile, ephemeris);

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

  const { id, name, epoch, ...elementTable } = elements;

  // create file path
  const fileName = _.kebabCase(name);
  const __filename = fileURLToPath(import.meta.url);
  console.log('__fileName:', __filename);
  const __dirname = path.dirname(__filename);
  console.log('__dirname:', __dirname);
  const pathToNewFile = path.resolve(
    __dirname,
    path.join('ephemerides', `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  const data = {
    id,
    name,
    epoch,
    physicalData,
    elementTable,
    vectorTable: vectors.table,
  };

  await fs.writeJSON(pathToNewFile, data);

  return { path: pathToNewFile };
}
