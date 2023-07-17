import fs from 'fs-extra';
import { z } from 'zod';
import horizonsURL from './horizonsURL';
import {
  parseElements,
  parsePhysicalData,
  parseVectors as parseVectorTable,
} from './parseEphemerides';
import type { ElementTable } from './types/ElementTable';
import { VectorTable } from './types/VectorTable';
import { Ephemeris } from './types/Ephemeris';

const J2000 = `'2000-Jan-01 12:00:00'`;

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
  // get URLSearchParam string
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
  // fetch ephemeris data from Horizons API
  const horizonsResponse = await fetch(urlQuery);
  const text = await horizonsResponse.text();

  // parse the JSON string and return the text result
  const parsedData = horizonsSchema.safeParse(JSON.parse(text));
  if (!parsedData.success) {
    console.error('error:', parsedData.error);
    throw new Error('error: parsing failed');
  } else {
    // get the string containing the ephemeris data and return it
    const result = parsedData.data.result;
    return result;
  }
}

export async function getElementTable(
  id: string,
  centerId = '500@10',
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // get the raw text data from the Horizons API
  const text = await fetchEphemerides(id, centerId, referencePlane, 'ELEMENTS');

  // parse the string to extract the element data
  const ephemeris: Ephemeris = parseElements(text);

  return ephemeris;
}

export async function getVectorTable(
  id: string,
  centerId = '500@10',
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // get the raw text data from Horizons API
  const text = await fetchEphemerides(id, centerId, referencePlane, 'PHYSICAL');

  // parse the string to extract the element data
  const ephemeris: Ephemeris = parseVectorTable(text);
  return ephemeris;
}

export async function getPhysicalData(
  id: string,
  centerId = '500@10',
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // get the raw text data from Horizons API
  const text = await fetchEphemerides(id, centerId, referencePlane, 'VECTORS');

  // parse physical data
  const physicalData = parsePhysicalData(text);
  return physicalData;
}

export async function getEphemerides(
  bodyCode: string,
  centerCode = '500@10',
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  const elements = await getElementTable(bodyCode, centerCode, referencePlane);
  const vectors = await getVectorTable(bodyCode, centerCode, referencePlane);

  return {
    elements,
    vectors,
  };
}
