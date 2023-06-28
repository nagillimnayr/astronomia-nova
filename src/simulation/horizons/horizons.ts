import fs from 'fs-extra';
import { parseHorizons } from './horizonsParser';

const url = 'https://ssd.jpl.nasa.gov/api/horizons.api';

const format = 'text';
const COMMAND = '499';
const OBJ_DATA = 'NO';
const MAKE_EPHEM = 'YES';
const EPHEM_TYPE = 'ELEMENTS';

const CENTER = '500@10';
const REF_PLANE = 'ECLIPTIC';
// const START_TIME = '';
// const STOP_TIME = '';
// const STEP_SIZE = '';
const TLIST = `'2000-Jan-01%2012:00:00'`;
// const QUANTITIES = 'EC';
const CSV_FORMAT = 'NO';

export function horizons(
  code: string,
  format: 'text' | 'json',
  outputFile: string
) {
  const query = `${url}?format=${format}&COMMAND=${code}&OBJ_DATA=${OBJ_DATA}&MAKE_EPHEM=${MAKE_EPHEM}&EPHEM_TYPE=${EPHEM_TYPE}&CENTER=${CENTER}&REF_PLANE=${REF_PLANE}&TLIST=${TLIST}&CSV_FORMAT=${CSV_FORMAT}`;

  const data = {
    format,
    COMMAND: code,
    OBJ_DATA,
    MAKE_EPHEM,
    EPHEM_TYPE,
    CENTER,
    REF_PLANE,
    TLIST,
    CSV_FORMAT,
  };

  fetch(query)
    .then((response) => {
      console.log('status code:', response.status);
      if (!response.ok) {
        return;
      }
      if (format === 'json') {
        response
          .json()
          .then((value) => {
            // console.log('json response: ', response);
            fs.writeFile(outputFile, value)
              .then(() => {
                console.log('data written to:', outputFile);
              })
              .catch((reason) => {
                console.error('error: ', reason);
              });
          })
          .catch((reason) => {
            console.error('error: ', reason);
          })

          .catch((reason) => {
            console.error('error: ', reason);
          });
      } else {
        response
          .text()
          .then((value) => {
            const parsedData = parseHorizonsElements(value);
            console.log(parsedData);
            fs.writeFile(outputFile, value)
              .then(() => {
                console.log('data written to:', outputFile);
              })
              .catch((reason) => {
                console.error('error: ', reason);
              });
          })
          .catch((reason) => {
            console.error('error: ', reason);
          });
      }
    })
    .catch((reason) => {
      console.error('error: ', reason);
    });
}

if (process.argv.length >= 5) {
  const code = process.argv[2];
  const format = process.argv[3];
  const outputFile = process.argv[4];

  if (code && outputFile && (format === 'text' || format === 'json')) {
    horizons(code, format, outputFile);
  }
} else {
  console.log('not enough arguments');
}
