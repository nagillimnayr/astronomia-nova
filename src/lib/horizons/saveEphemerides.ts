import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';

import { ElementTable } from './types/ElementTable';
import { VectorTable } from './types/VectorTable';
import { Ephemeris } from './types/Ephemeris';
import { EphemerisType } from './getEphemerides';

export function saveElementTable(elementTable: ElementTable) {
  //
}

export function saveVectorTable(vectorTable: VectorTable) {
  //
}

export async function saveEphemeris(ephemeris: Ephemeris, type: EphemerisType) {
  const name = ephemeris.name;
  const date = ephemeris.epoch;
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
