import fs from 'fs-extra';
import { z } from 'zod';
import url from './horizonsURL';
import { ElementTable, parseElements, parseVectors } from './parseEphemerides';

const J2000 = `\'2000-Jan-01 12:00:00\'`;

const horizonsSchema = z.object({
  result: z.string(),
  signature: z.object({
    version: z.string(),
    source: z.string(),
  }),
});

type ReferencePlane = 'ECLIPTIC' | 'FRAME' | 'BODY' | 'EQUATOR';
type EphemerisType = 'ELEMENTS' | 'VECTORS';

async function fetchEphemerides(
  bodyCode: string,
  centerCode: string,
  referencePlane: ReferencePlane = 'ECLIPTIC',
  ephemerisType: EphemerisType
) {
  // get URLSearchParam string
  const searchParams = new URLSearchParams({
    format: 'json',
    COMMAND: bodyCode,
    OBJ_DATA: 'NO',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: ephemerisType,
    CENTER: centerCode,
    REF_PLANE: referencePlane,
    TLIST: J2000,
    CSV_FORMAT: 'NO',
  });
  console.log('url search params:', searchParams);
  const urlQuery = url + '?' + searchParams.toString();
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

export async function getElements(
  bodyCode: string,
  centerCode = '500@10',
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // get the raw text data from Horizons API
  const text = await fetchEphemerides(
    bodyCode,
    centerCode,
    referencePlane,
    'ELEMENTS'
  );

  // parse the string to extract the element data
  const elementTable = parseElements(text);
  return elementTable;
}
export async function getVectors(
  bodyCode: string,
  centerCode = '500@10',
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  // get the raw text data from Horizons API
  const text = await fetchEphemerides(
    bodyCode,
    centerCode,
    referencePlane,
    'VECTORS'
  );

  // parse the string to extract the element data
  const vectorTable = parseVectors(text);
  return vectorTable;
}

export async function getEphemerides(
  bodyCode: string,
  centerCode = '500@10',
  referencePlane: ReferencePlane = 'ECLIPTIC'
) {
  const elements = await getElements(bodyCode, centerCode, referencePlane);
  const vectors = await getVectors(bodyCode, centerCode, referencePlane);

  return {
    elements,
    vectors,
  };
}
