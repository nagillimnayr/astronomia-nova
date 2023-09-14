/**
 * @module getEphemerides
 */
import { z } from 'zod';
import { parseElements, parseEphemerisDate, parseEphemerisName, parsePhysicalData } from './parseEphemerides';
import { TWO_PI } from '@/constants';
import { Vector3 } from 'three';
import { ElementTable } from './types/ElementTable';
import { getRadiusAtTrueAnomaly } from '../physics/orbital-elements/orbital-radius';
import { getPositionFromRadius } from '../physics/orbital-state-vectors/position';
import { getOrbitalSpeedFromRadius, getVelocityDirectionFromOrbitalElements } from '../physics/orbital-state-vectors/velocity';
import { VectorTable } from './types/VectorTable';

const horizonsURL: Readonly<string> =
  'https://ssd.jpl.nasa.gov/api/horizons.api';

const J2000 = `'2000-Jan-01 12:00:00'`;
const SUN_CENTER = '500@10';
// const SOLAR_SYSTEM_BARYCENTER = '500@0';
const DEFAULT_CENTER = SUN_CENTER;

const horizonsSchema = z.object({
  result: z.string(),
  signature: z.object({
    version: z.string(),
    source: z.string(),
  }),
});

type ReferencePlane = 'ECLIPTIC' | 'FRAME' | 'BODY' | 'EQUATOR';
type EphemerisType = 'ELEMENTS' | 'VECTORS' | 'PHYSICAL';

const _pos = new Vector3();
const _vel = new Vector3();


async function fetchEphemerides(
  id: string,
  centerId: string,
  referencePlane: ReferencePlane = 'ECLIPTIC',
  ephemerisType: EphemerisType
) {
  // Get URLSearchParam string.
  const searchParams = new URLSearchParams({
    format: 'json',
    COMMAND: `'${id}'`,
    OBJ_DATA: 'YES',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: ephemerisType === 'PHYSICAL' ? 'VECTORS' : ephemerisType,
    CENTER: centerId,
    REF_PLANE: referencePlane,
    TLIST: J2000,
    CSV_FORMAT: 'NO',
  });
  console.log('url search params:', searchParams);
  const urlQuery = horizonsURL + '?' + searchParams.toString();
  console.log('url:', urlQuery);
  // Fetch ephemeris data from Horizons API.
  const horizonsResponse = await fetch(urlQuery);

  // Parse the JSON string and return the text result.
  const parsedData = horizonsSchema.safeParse(
    JSON.parse((await horizonsResponse.text()) as string)
  );
  if (!parsedData.success) {
    console.error('error:', parsedData.error);
    throw new Error('error: parsing failed');
  }
  // Get the string containing the ephemeris data and return it.
  return parsedData.data.result;
}

export async function getElementTable(
  id: string,
  centerId = DEFAULT_CENTER,
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // Get the raw text data from the Horizons API.
  const text = await fetchEphemerides(id, centerId, referencePlane, 'ELEMENTS');

  // Parse the string to extract the element data.
  return parseElements(text);
}

export async function getPhysicalData(
  id: string, // Horizons' id for body.
  centerId = DEFAULT_CENTER, // Horizons' id for central body.
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // Get the raw text data from Horizons API.
  const text = await fetchEphemerides(id, centerId, referencePlane, 'PHYSICAL');

  // Parse physical data.
  const physicalDataTable = parsePhysicalData(text);
 
  const name = parseEphemerisName(text, 'Target');

  return {
    id,
    name,
    table: physicalDataTable
  }

}

export async function getEphemerides(
  id: string, // Horizons' id for body.
  centerId = DEFAULT_CENTER, // Horizons' id for central body.
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  
  // Get the raw text data from the Horizons API.
  const text = await fetchEphemerides(id, centerId, referencePlane, 'ELEMENTS');

  // Get ephemeris data from Horizons.
  const elementTable = parseElements(text);
  const physicalDataTable = parsePhysicalData(text);

  const name = parseEphemerisName(text, 'Target');
  const centerName = parseEphemerisName(text, 'Center');
  const epoch = parseEphemerisDate(text);

  return {
    id,
    name,
    centerId,
    centerName,
    epoch,
    elementTable,
    physicalDataTable,
  };
}


export function computeVectorTable(
  elementTable: ElementTable,
  centralMass: number
) {

  const { semiMajorAxis, eccentricity, trueAnomaly} = elementTable;

  const radius = getRadiusAtTrueAnomaly(
    trueAnomaly,
    semiMajorAxis,
    eccentricity
  );
  getPositionFromRadius(radius, trueAnomaly, _pos);

  // The Horizons ephemeris data for Jupiter seems to result in it wobbling a
  // bit on its orbit. Re-computing the velocity fixes the issue.

  // Compute the initial orbital speed.
  const orbitalSpeed = getOrbitalSpeedFromRadius(
    radius,
    centralMass,
    semiMajorAxis
  );

  // Compute the direction of the velocity vector.
  getVelocityDirectionFromOrbitalElements(trueAnomaly, eccentricity, _vel);
  _vel.multiplyScalar(orbitalSpeed);

  const vectorTable: VectorTable = {
    position: _pos.toArray(),
    velocity: _vel.toArray(),
  } ;


  return vectorTable;
}
