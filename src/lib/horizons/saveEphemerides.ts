import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';

import { ElementTable } from './types/ElementTable';
import { VectorTable } from './types/VectorTable';

export function saveElementTable(elementTable: ElementTable) {
  //
}

export function saveVectorTable(vectorTable: VectorTable) {
  //
}

export function saveEphemeris(ephemeris: ElementTable | VectorTable) {
  const name = ephemeris.name;
  const date = ephemeris.date;
  // create file path
  const fileName = _.kebabCase(name);
  const __filename = fileURLToPath(import.meta.url);
  console.log('__fileName:', __filename);
  const __dirname = path.dirname(__filename);
  console.log('__dirname:', __dirname);
  const pathToNewFile = path.resolve(
    __dirname,
    path.join('recordedData', `${fileName}.json`)
  );
  console.log('pathToNewFile:', pathToNewFile);

  return fs.writeJSON(pathToNewFile, ephemeris);
}
