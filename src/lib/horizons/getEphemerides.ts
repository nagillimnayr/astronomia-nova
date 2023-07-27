import { z } from 'zod';
import horizonsURL from './horizonsURL';
import {
  parseElements,
  parsePhysicalData,
  parseVectors as parseVectorTable,
} from './parseEphemerides';

import { type Ephemeris } from './types/Ephemeris';

const J2000 = `'2000-Jan-01 12:00:00'`;
const SUN_CENTER = '500@10';
const SOLAR_SYSTEM_BARYCENTER = '500@0';
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
  const text = await horizonsResponse.text();

  // Parse the JSON string and return the text result.
  const parsedData = horizonsSchema.safeParse(JSON.parse(text));
  if (!parsedData.success) {
    console.error('error:', parsedData.error);
    throw new Error('error: parsing failed');
  } else {
    // Get the string containing the ephemeris data and return it.
    const result = parsedData.data.result;
    return result;
  }
}

export async function getElementTable(
  id: string,
  centerId = DEFAULT_CENTER,
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // Get the raw text data from the Horizons API.
  const text = await fetchEphemerides(id, centerId, referencePlane, 'ELEMENTS');

  // Parse the string to extract the element data.
  const ephemeris: Ephemeris = parseElements(text);

  return ephemeris;
}

export async function getVectorTable(
  id: string, // Horizons' id for body.
  centerId = DEFAULT_CENTER, // Horizons' id for central body.
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // Get the raw text data from Horizons API.
  const text = await fetchEphemerides(id, centerId, referencePlane, 'VECTORS');

  // Parse the string to extract the element data.
  const ephemeris: Ephemeris = parseVectorTable(text);
  return ephemeris;
}

export async function getPhysicalData(
  id: string, // Horizons' id for body.
  centerId = DEFAULT_CENTER, // Horizons' id for central body.
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // Get the raw text data from Horizons API.
  const text = await fetchEphemerides(id, centerId, referencePlane, 'PHYSICAL');

  // Parse physical data.
  const physicalData = parsePhysicalData(text);
  return physicalData;
}

export async function getEphemerides(
  id: string, // Horizons' id for body.
  centerId = DEFAULT_CENTER, // Horizons' id for central body.
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // Get ephemeris data from Horizons.
  const elements = await getElementTable(id, centerId, referencePlane);
  const vectors = await getVectorTable(id, centerId, referencePlane);
  const physicalData = await getPhysicalData(id, centerId, referencePlane);
  return {
    elements,
    vectors,
    physicalData,
  };
}
