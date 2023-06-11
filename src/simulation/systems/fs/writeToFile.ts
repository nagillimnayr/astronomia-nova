import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export function writeToFile(fileName: string, data: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pathToNewFile = path.resolve(
    __dirname,
    path.join('..','..','data','recordedData', fileName)
  );

  try {
      fs.writeFile(pathToNewFile, data);
    } catch (err) {
      console.error(err);
    }

}
