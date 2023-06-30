import type { Vector3Tuple } from 'three';
import { KM_TO_M } from '../utils/constants';
import type { ElementCode } from './elementCodes';
import type { VectorCode } from './vectorCodes';

import type { ElementTable } from './types/ElementTable';
import type { VectorTable } from './types/VectorTable';
import _ from 'lodash';
import { object } from 'zod';

export function parseEphemeris(
  text: string,
  code: Readonly<ElementCode | VectorCode>
) {
  const regexStr = `${code}\\s*=\\s*([^\\s]*)\\s`;
  const regexp = new RegExp(regexStr);
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.error(`code ${code} was not found`);
    console.log('text:', text);
    console.log('matches:', matches);
    throw new Error('no match found!');
  }
  const ephemeris = parseFloat(matches[1]) ?? 0;
  return ephemeris;
}

export function parseEphemerisDate(text: Readonly<string>) {
  const regexp = /A\.D\.\s(.*)\sTDB/;
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.error('text:', text);
    console.error('matches:', matches);
    throw new Error('no match found!');
  }
  // get the substring containing the date info
  const dateStr = matches[1];

  // split the date substring on ' ' into year-month-day / time
  const [yearMonthDay, time] = _.split(dateStr, /\s/);

  // split the year/month/day on '-'
  const [year, month, day] = _.split(yearMonthDay, /\-/);

  // construct a date object
  const date = new Date();

  return date;
}
export function parseEphemerisName(text: Readonly<string>) {
  const regexp = /Target body name:\s*(\S*)\s/;
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.error('text:', text);
    console.error('matches:', matches);
    throw new Error('no match found!');
  }
  const targetName = matches[1];
  return targetName;
}

export function parseElements(text: Readonly<string>): ElementTable {
  // get text with elements data
  const matches = text.match(/SOE\n([^]*)\$\$EOE/);
  if (!matches || matches.length < 2) {
    console.log('error! no match found in:', text);
    throw new Error('no match found!');
  }

  // get the substring that contains the ephemeris data
  const substr = matches[1];
  if (!substr) {
    const errorMsg = 'error: no element data found';
    throw new Error(errorMsg);
  }

  return {
    name: parseEphemerisName(text),
    date: parseEphemerisDate(substr),
    eccentricity: parseEphemeris(substr, 'EC'),
    periapsis: parseEphemeris(substr, 'QR'),
    inclination: parseEphemeris(substr, 'IN'),
    longitudeOfAscendingNode: parseEphemeris(substr, 'OM'),
    argumentOfPeriapsis: parseEphemeris(substr, 'W'),
    timeOfPeriapsis: parseEphemeris(substr, 'Tp'),
    meanMotion: parseEphemeris(substr, 'N'),
    meanAnomaly: parseEphemeris(substr, 'MA'),
    trueAnomaly: parseEphemeris(substr, 'TA'),
    semiMajorAxis: parseEphemeris(substr, 'A'),
    apoapsis: parseEphemeris(substr, 'AD'),
    siderealOrbitPeriod: parseEphemeris(substr, 'PR'),
  };
}

export function parseVectors(text: Readonly<string>): VectorTable {
  // get text with vector data

  const matches = text.match(/SOE\n([^]*)\$\$EOE/);
  if (!matches || matches.length < 2) {
    console.log('error! no match found in:', text);
    throw new Error('no match found!');
  }

  // get the substring that contains the ephemeris data
  const substr = matches[1];
  if (!substr) {
    const errorMsg = 'error: no vector data found';
    throw new Error(errorMsg);
  }

  const x = parseEphemeris(substr, 'X') * KM_TO_M; // (m)
  const y = parseEphemeris(substr, 'Y') * KM_TO_M; // (m)
  const z = parseEphemeris(substr, 'Z') * KM_TO_M; // (m)
  const vx = parseEphemeris(substr, 'VX') * KM_TO_M; // (m/s)
  const vy = parseEphemeris(substr, 'VY') * KM_TO_M; // (m/s)
  const vz = parseEphemeris(substr, 'VZ') * KM_TO_M; // (m/s)
  const range = parseEphemeris(substr, 'RG') * KM_TO_M; // (m)
  const rangeRate = parseEphemeris(substr, 'RR') * KM_TO_M; // (m/s)

  return {
    name: parseEphemerisName(text),
    date: parseEphemerisDate(substr),
    position: [x, y, z],
    velocity: [vx, vy, vz],
    range,
    rangeRate,
  };
}
