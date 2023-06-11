import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

export async function writeToJSON<T>(dataSet: T, fileName: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pathToNewFile = path.resolve(
    __dirname,
    path.join('..', '..', 'data', 'recordedData', fileName)
  );

  let success: boolean = false;

  try {
    await fs.writeJSON(pathToNewFile, {
      data: dataSet
    }).then(() => {
      success = true;
      console.log('Write complete: \'', fileName, '\' written to:', pathToNewFile);
    }, () => {
      success = false;
      console.log('Write failed');
    }).catch(error => console.error(error));
  } catch (err) {
    console.error(err);
  }
  return success;
}
