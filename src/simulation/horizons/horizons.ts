import fs from 'fs-extra';
import { getEphemerides } from './getEphemerides';

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

// export function horizons(code: string, outputFile?: string) {
//   const query = `${url}?format=${format}&COMMAND=${code}&OBJ_DATA=${OBJ_DATA}&MAKE_EPHEM=${MAKE_EPHEM}&EPHEM_TYPE=${EPHEM_TYPE}&CENTER=${CENTER}&REF_PLANE=${REF_PLANE}&TLIST=${TLIST}&CSV_FORMAT=${CSV_FORMAT}`;

//   fetch(query)
//     .then((response) => {
//       console.log('status code:', response.status);
//       if (!response.ok) {
//         throw new Error(`error! status code: ${response.status}`);
//       }

//       response
//         .text()
//         .then((value) => {
//           const parsedData = parseHorizonsElements(value);
//           console.log(parsedData);
//           if (outputFile) {
//             fs.writeFile('raw_' + outputFile, value)
//               .then(() => {
//                 console.log('data written to:', outputFile);
//               })
//               .catch((reason) => {
//                 console.error('error: ', reason);
//               });
//           }
//         })
//         .catch((reason) => {
//           console.error('error: ', reason);
//         });
//     })

//     .catch((reason) => {
//       console.error('error: ', reason);
//     });
// }

async function horizons(code: string) {
  const ephemerides = await getEphemerides(code);
  return ephemerides;
}

if (process.argv.length >= 3) {
  const code = process.argv[2];
  // const outputFile = process.argv[3];

  if (code) {
    try {
      const ephemerides = await horizons(code);
      ephemerides;
      console.log('elements:', ephemerides.elements);
      console.log('vectors:', ephemerides.vectors);
    } catch (e) {
      console.error(e);
    }
  }
} else {
  console.log('not enough arguments');
}
