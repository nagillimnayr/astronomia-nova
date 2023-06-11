import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';


export async function writeToJSON<T>(fileName: string) {
  // Get path to file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pathToFile = path.resolve(
    __dirname,
    path.join('..', '..', 'data', 'recordedData', fileName)
  );

  const data = await fs.readJson(pathToFile).then((packageObj) => {
    return packageObj;
  }, (reason) => { console.error(reason); return null; });
  return data;
}
