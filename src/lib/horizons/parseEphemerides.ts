import type { ElementCode } from './elementCodes';
import type { VectorCode } from './vectorCodes';

import type { ElementTable } from './types/ElementTable';
import type { VectorTable } from './types/VectorTable';
import _ from 'lodash';
import { type Ephemeris } from './types/Ephemeris';
import {
  type PhysicalDataTable,
  type PhysicalData,
} from './types/PhysicalData';
import { radToDeg } from 'three/src/math/MathUtils';
import { DAY, TWO_PI } from '@/simulation/utils/constants';

const KM_TO_M = 1000;

/**
 * @description
 * @author Ryan Milligan
 * @date 08/07/2023
 * @export
 * @param {string} text
 * @param {(Readonly<ElementCode | VectorCode>)} code
 * @returns {*}
 */
export function parseEphemerisTable(
  text: string,
  code: Readonly<ElementCode | VectorCode>
) {
  // Todo: use named capture groups.
  const regexStr = `\\s${code}\\s*=\\s*([^\\s]*)\\s`;
  const regexp = new RegExp(regexStr);
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.error(`code ${code} was not found`);
    console.log('text:', text);
    console.log('matches:', matches);
    throw new Error('no match found!');
  }

  const match = matches[1];
  // console.log(`match (${code}):`, match);
  // parse string into float
  const ephemeris = parseFloat(match);
  if (ephemeris === undefined) {
    throw new Error(`error: failed to parse value (${match}) into a float`);
  }
  // console.log(`parsed (${code}):`, ephemeris);
  return ephemeris;
}

export function parseEphemerisDate(text: Readonly<string>) {
  // Todo: use named capture groups.
  const regexp = /A\.D\.\s(.*)\sTDB/;
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.log(`error! no match found for { ${regexp.source} } in:`, text);
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

  // Todo: Convert to numbers.

  // construct a date object
  const date = new Date();

  return dateStr;
}

export function parseEphemerisName(
  text: Readonly<string>,
  target: 'Target' | 'Center'
) {
  // extracts the substring that contains name and id of the body
  // takes the form:
  /**
   * captures the substrings that contain the name and id of the body
   *
   * The line in the raw text that contains the name and id takes the form:
   * Target body name: Mars (499)                      {source: mar097}
   *
   * we want to capture 'Mars' and '499'
   *
   * '\s' = character class escape for matching whitespace characters
   * '\S' = character class escape for matching non-whitespace characters
   * '\d' = character escape class for matching digits (0 - 9)
   * '.' = wildcard, matches any character except line terminators
   * '()' = capture group, records any substring that matches the pattern inside of the parentheses
   * '\(' and '\)' = character escapes for literal parentheses characters
   * '+' = quantifier for (1 - infinity) occurrences
   * '*' = quantifier for (0 - infinity) occurrences
   *
   * the '\s*(.+)\s' pattern will capture a substring between whitespace characters
   * We must take into consideration that some bodies have names which contain numbers and/or spaces, or ids which contain letters and/or spaces (i.e. 1999 Hirayama (1973 DR))
   * the \((.+)\) pattern will capture a substring between parentheses
   * '/Target body name:\s*(.+)\s*\((.+)\)/' will capture the substring in-between 'Target body name: ' and ' (' and then capture the substring between the parentheses.
   * */
  const regexStr = `${target} body name:\\s*(.+)\\s*\\((.+)\\)`;
  // const regexp = /Target body name:\s*(.+)\s*\((.+)\)/;
  const regexp = new RegExp(regexStr);
  const matches = text.match(regexp);

  // the captured substrings start at index 1, so the length of the array should be 3
  if (!matches || matches.length < 3 || !matches[1] || !matches[2]) {
    console.error('text:', text);
    console.error('matches:', matches);

    throw new Error('no match found!');
  }
  const name = matches[1];
  const id = matches[2];

  return [name, id];
}

export function parseElements(text: Readonly<string>): Ephemeris {
  // Get substring with elements data.
  // Todo: use named capture groups.
  const regexp = /SOE\n([^]*)\$\$EOE/;
  const matches = text.match(/SOE\n([^]*)\$\$EOE/);
  if (!matches || matches.length < 2) {
    console.log(`error! no match found for { ${regexp.source} } in:`, text);
    throw new Error('no match found!');
  }

  // get the substring that contains the ephemeris data
  const substr = matches[1];
  if (!substr) {
    const errorMsg = 'error: no element data found';
    throw new Error(errorMsg);
  }

  const [name, id] = parseEphemerisName(text, 'Target');
  const [centerName, centerId] = parseEphemerisName(text, 'Center');
  if (!name || !id || !centerName || !centerId) {
    throw new Error('invalid id/name');
  }

  const date = parseEphemerisDate(substr);
  const elementTable: ElementTable = {
    eccentricity: parseEphemerisTable(substr, 'EC'),
    periapsis: parseEphemerisTable(substr, 'QR') * KM_TO_M,
    inclination: parseEphemerisTable(substr, 'IN'),
    longitudeOfAscendingNode: parseEphemerisTable(substr, 'OM'),
    argumentOfPeriapsis: parseEphemerisTable(substr, 'W'),
    timeOfPeriapsis: parseEphemerisTable(substr, 'Tp'),
    meanMotion: parseEphemerisTable(substr, 'N'),
    meanAnomaly: parseEphemerisTable(substr, 'MA'),
    trueAnomaly: parseEphemerisTable(substr, 'TA'),
    semiMajorAxis: parseEphemerisTable(substr, 'A') * KM_TO_M,
    apoapsis: parseEphemerisTable(substr, 'AD') * KM_TO_M,
    siderealOrbitPeriod: parseEphemerisTable(substr, 'PR'),
  };

  const ephemeris: Ephemeris = {
    id,
    name,
    centerId,
    centerName,
    epoch: parseEphemerisDate(substr),
    ephemerisType: 'ELEMENTS',
    table: elementTable,
  };
  return ephemeris;
}

export function parseVectors(text: Readonly<string>): Ephemeris {
  // Get text with vector data.
  // Todo: use named capture groups.
  const regexp = /SOE\n([^]*)\$\$EOE/;
  const matches = text.match(/SOE\n([^]*)\$\$EOE/);
  if (!matches || matches.length < 2) {
    console.log(`error! no match found for { ${regexp.source} } in:`, text);
    throw new Error('no match found!');
  }

  // get the substring that contains the ephemeris data
  const substr = matches[1];
  if (!substr) {
    const errorMsg = 'error: no vector data found';
    throw new Error(errorMsg);
  }

  const x = parseEphemerisTable(substr, 'X') * KM_TO_M; // (m)
  const y = parseEphemerisTable(substr, 'Y') * KM_TO_M; // (m)
  const z = parseEphemerisTable(substr, 'Z') * KM_TO_M; // (m)
  const vx = parseEphemerisTable(substr, 'VX') * KM_TO_M; // (m/s)
  const vy = parseEphemerisTable(substr, 'VY') * KM_TO_M; // (m/s)
  const vz = parseEphemerisTable(substr, 'VZ') * KM_TO_M; // (m/s)
  const range = parseEphemerisTable(substr, 'RG') * KM_TO_M; // (m)
  const rangeRate = parseEphemerisTable(substr, 'RR') * KM_TO_M; // (m/s)

  const [name, id] = parseEphemerisName(text, 'Target');
  const [centerName, centerId] = parseEphemerisName(text, 'Center');
  if (!name || !id || !centerName || !centerId) {
    throw new Error('invalid id/name');
  }

  const vectorTable: VectorTable = {
    position: [x, y, z],
    velocity: [vx, vy, vz],
    range,
    rangeRate,
  };

  const ephemeris: Ephemeris = {
    id,
    name,
    centerId,
    centerName,
    epoch: parseEphemerisDate(substr),
    ephemerisType: 'VECTORS',
    table: vectorTable,
  };

  return ephemeris;
}

export function parsePhysicalData(text: Readonly<string>): PhysicalData {
  // Get the substring that contains the physical data.
  // NOTE: For the Earth, 'PHYSICAL DATA' is replaced with 'GEOPHYSICAL PROPERTIES'. For the Moon, 'GEOPHYSICAL PROPERTIES' is replaced with 'GEOPHYSICAL DATA'.
  const regexp =
    /(?:(?:PHYSICAL|GEOPHYSICAL)\s*(?:PROPERTIES|DATA))(?<physData>[^]*)\s*(?:Hill|Perihelion|(?:\*{5,}))/i;
  const matches = text.match(regexp);
  if (!matches || !matches.groups || matches.length < 2) {
    console.log(`error! no match found for { ${regexp.source} } in:`, text);
    throw new Error('no match found!');
  }

  // Get the matched substring.
  const substr = matches[1];
  // const substr = matches.groups['physData'];
  if (!substr) {
    const errorMsg = 'error: no physical data found';
    throw new Error(errorMsg);
  }

  // Unfortunately, there are significant inconsistencies with how the data is presented, depending on the body. (i.e. capitalization, the exponent of the scientific notation, etc.) So we need to match and capture this data separately.
  const massExponent = getMassExponent(substr);

  const table: PhysicalDataTable = {
    meanRadius: capturePhysicalProperty(substr, 'mean radius') * KM_TO_M, // (m)
    mass: capturePhysicalProperty(substr, 'Mass') * massExponent, // (kg)
    // siderealRotPeriod: capturePhysicalProperty(substr, 'Sidereal rot. period'), // (hrs)
    siderealRotRate: radToDeg(getRotationRate(substr)), // (deg/s)
    gravParameter: capturePhysicalProperty(substr, 'GM') * KM_TO_M, // (m^3/s^2)
    obliquity: capturePhysicalProperty(substr, 'Obliquity'), // axial tilt (deg)
  };

  const [name, id] = parseEphemerisName(text, 'Target');
  if (!name || !id) {
    throw new Error('invalid id/name');
  }

  const physicalData = {
    id,
    name,
    table,
  };

  return physicalData;
}

function capturePhysicalProperty(text: string, property: string) {
  // Skip everything after the property name until an '=', then skip any whitespace after the '=', capture everything from the first non-whitespace character until the next whitespace character or a '+'.
  // NOTE: For whatever reason, the casing of property names is inconsistent between tables for different bodies. Adding the 'i' flag when constructing the RegExp object makes the pattern case-insensitive.

  const regexStr = `${property}[^=]*=\\s*~*([^\\s]*)[\\s\\+]`;
  const regexp = new RegExp(regexStr, 'i');
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.error(`property '${property}' was not found`);
    console.log('text:', text);
    console.log('matches:', matches);
    throw new Error('no match found!');
  }

  const match = matches[1];
  // parse string into float
  const data = parseFloat(match);
  if (data === undefined) {
    throw new Error(`error: failed to parse value (${match}) into a float`);
  }

  return data;
}

function getMassExponent(text: string) {
  // Get the exponent of the scientific notation for the mass. (e.g. The line for the mass of Saturn looks like: `Mass x10^26 (kg)      = 5.6834` and we want to capture the `26`)
  // NOTE: For some god-forsaken reason, the mass for Jupiter is given in grams, despite Jupiter being the most massive planet.
  // i.e.: Mass x 10^22 (g)      = 189818722 +- 8817
  // It's like they want to make this as annoying as possible. I'm seriously considering emailing the author to complain.

  // NOTE: There may or may not be a comma after Mass, there may or may not be an x or a space between x and 10. There may or may not be parentheses around the unit.
  const regexp =
    /Mass{1},?\s*x?\s*10\^(?<exponent>[\d]*)\s*\(?(?<unit>kg|g){1}\)?/i;
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches.groups) {
    console.log(`error! no match found for { ${regexp.source} } in:`, text);
    throw new Error('no match found!');
  }
  const exponent = matches.groups['exponent'];
  if (!exponent) {
    throw new Error('error: no exponent found');
  }
  const unit = matches.groups['unit']; // Check whether in kg or grams
  if (!unit) {
    throw new Error('error: no unit found');
  }
  let massExponent = 0;
  if (unit === 'g') {
    massExponent = parseFloat(`1e+${parseFloat(exponent) - 3}`);
  }
  massExponent = parseFloat(`1e+${exponent}`); // (i.e. 1e+26)
  if (massExponent === undefined) {
    throw new Error(`error: failed to parse value (${exponent}) into a float`);
  }

  return massExponent;
}

function getRotationRate(text: string) {
  // NOTE: The physical data for the Sun does not include rotation rate, but it does include rotation period.

  // Attempt to get the rotation rate.
  const property = 'rot. rate';
  const regexStr = `${property}[^=]*=\\s*([^\\s]*)[\\s\\+]`;
  const regexpRate = new RegExp(regexStr, 'i');
  const matches = text.match(regexpRate);

  if (matches && matches.length >= 2 && matches[1]) {
    const match = matches[1];
    // parse string into float
    const data = parseFloat(match);
    if (data === undefined) {
      throw new Error(`error: failed to parse value (${match}) into a float`);
    }

    return data;
  }

  // If rotation rate couldn't be found, try rotation period
  const regexpPeriod =
    /(?:rot){1}(?:ation)?.?\s*(?:per){1}(?:iod)?.?\s*.*={1}\s*(?<rotationPeriod>\d*\.?\d*\s?(?:[hmsd])?)/;

  const periodMatches = text.match(regexpPeriod);

  if (!periodMatches || periodMatches.length < 2 || !periodMatches[1]) {
    console.error(`rotation period was not found`);
    console.log('text:', text);
    console.log('matches:', periodMatches);
    throw new Error('no match found!');
  }
  const match = periodMatches[1];

  // Parse float.
  const rotationPeriod = parseFloat(match);
  if (rotationPeriod === undefined) {
    throw new Error(`error: failed to parse value (${match}) into a float`);
  }

  // Convert period in days into rate (rad/s).
  const periodInSeconds = rotationPeriod * DAY;
  const rate = TWO_PI / periodInSeconds;

  return rate;
}
