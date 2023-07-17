import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';

import { ElementTable } from './types/ElementTable';
import { VectorTable } from './types/VectorTable';
import { Ephemeris } from './types/Ephemeris';

export function saveElementTable(elementTable: ElementTable) {
  //
}

export function saveVectorTable(vectorTable: VectorTable) {
  //
}

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
};

export async function saveEphemerides(ephemerides: Ephemerides) {
  const { elements, vectors } = ephemerides;
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
    elementTable,
    vectorTable: vectors.table,
  };

  await fs.writeJSON(pathToNewFile, data);

  return { path: pathToNewFile };
}
