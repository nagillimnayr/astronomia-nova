import { Vector3Tuple } from 'three';
import { KM_TO_M } from '../utils/constants';
import { ElementCode } from './elementCodes';
import { VectorCode } from './vectorCodes';

export type ElementTable = {
  eccentricity: number;
  periapsis: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  timeOfPeriapsis: number;
  meanMotion: number;
  meanAnomaly: number;
  trueAnomaly: number;
  semiMajorAxis: number;
  apoapsis: number;
  siderealOrbitPeriod: number;
};

type VectorTable = {
  position: Vector3Tuple;
  velocity: Vector3Tuple;
  range: number;
  rangeRate: number;
};

export function parseEphemeris(
  text: string,
  code: Readonly<ElementCode | VectorCode>
) {
  const regexStr = `${code}\\s*=\\s*([^\\s]*)\\s`;
  const regexp = new RegExp(regexStr);
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.error('no match found');
    return 0;
  }
  const ephemeris = parseFloat(matches[1]) ?? 0;
  return ephemeris;
}

export function parseElements(text: Readonly<string>): ElementTable {
  // get text with elements data
  const elementsStr = text.match(/SOE([^]*)\$\$EOE/)![1];
  if (!elementsStr) {
    const errorMsg = 'error: no element data found';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return {
    eccentricity: parseEphemeris(elementsStr, 'EC'),
    periapsis: parseEphemeris(elementsStr, 'QR'),
    inclination: parseEphemeris(elementsStr, 'IN'),
    longitudeOfAscendingNode: parseEphemeris(elementsStr, 'OM'),
    argumentOfPeriapsis: parseEphemeris(elementsStr, 'W'),
    timeOfPeriapsis: parseEphemeris(elementsStr, 'Tp'),
    meanMotion: parseEphemeris(elementsStr, 'N'),
    meanAnomaly: parseEphemeris(elementsStr, 'MA'),
    trueAnomaly: parseEphemeris(elementsStr, 'TA'),
    semiMajorAxis: parseEphemeris(elementsStr, 'A'),
    apoapsis: parseEphemeris(elementsStr, 'AD'),
    siderealOrbitPeriod: parseEphemeris(elementsStr, 'PR'),
  };
}

export function parseVectors(text: Readonly<string>): VectorTable {
  // get text with vector data
  const vectorStr = text.match(/SOE([^]*)\$\$EOE/)![1];
  if (!vectorStr) {
    const errorMsg = 'error: no element data found';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const x = parseEphemeris(vectorStr, 'X') * KM_TO_M; // (m)
  const y = parseEphemeris(vectorStr, 'Y') * KM_TO_M; // (m)
  const z = parseEphemeris(vectorStr, 'Z') * KM_TO_M; // (m)
  const vx = parseEphemeris(vectorStr, 'VX') * KM_TO_M; // (m/s)
  const vy = parseEphemeris(vectorStr, 'VY') * KM_TO_M; // (m/s)
  const vz = parseEphemeris(vectorStr, 'VZ') * KM_TO_M; // (m/s)
  const range = parseEphemeris(vectorStr, 'RG') * KM_TO_M; // (m)
  const rangeRate = parseEphemeris(vectorStr, 'RR') * KM_TO_M; // (m/s)

  return {
    position: [x, y, z],
    velocity: [vx, vy, vz],
    range,
    rangeRate,
  };
}
