/**
 * @module getEphemerides
 */
import { z } from 'zod';
import { parseElements, parsePhysicalData } from './parseEphemerides';
import { TWO_PI } from '@/constants';

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
    OBJ_DATA: ephemerisType === 'PHYSICAL' ? 'YES' : 'NO',
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
  const parsedPhysicalData = parsePhysicalData(text);

  const siderealRotationRate = parsedPhysicalData.table.siderealRotationRate;

  const siderealRotationPeriod = TWO_PI / siderealRotationRate; // Time in seconds to make one full rotation about the body's polar axis.
  return parsePhysicalData(text);
}

export async function getEphemerides(
  id: string, // Horizons' id for body.
  centerId = DEFAULT_CENTER, // Horizons' id for central body.
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // Get ephemeris data from Horizons.
  const elements = await getElementTable(id, centerId, referencePlane);
  const physicalData = await getPhysicalData(id, centerId, referencePlane);
  const elementTable = elements.table;
  const physicalDataTable = physicalData.table;
  const { name, epoch, centerName } = elements;
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
