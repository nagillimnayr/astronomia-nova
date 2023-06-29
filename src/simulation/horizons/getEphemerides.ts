import fs from 'fs-extra';
import { z } from 'zod';
import url from './horizonsURL';
import { ElementTable } from './parseEphemerides';

const J2000 = `'2000-Jan-01%2012:00:00'`;

const horizonsSchema = z.object({
  result: z.string(),
  signature: z.object({
    version: z.string(),
    source: z.string(),
  }),
});

type EphemerisParams = {
  bodyCode: string;
  centerCode: string;
  referencePlane: 'ECLIPTIC' | 'FRAME' | 'BODY' | 'EQUATOR';
};
type APIParams = EphemerisParams & {
  ephemerisType: 'ELEMENTS' | 'VECTORS';
};

async function fetchEphemerides({
  bodyCode,
  centerCode,
  referencePlane,
  ephemerisType,
}: APIParams) {
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

  const horizonsResponse = await fetch(url + searchParams.toString());
  const text = await horizonsResponse.text();

  // parse the JSON string and return the text result
  const parsedData = horizonsSchema.safeParse(JSON.parse(text));
  if (!parsedData.success) {
    console.error('error:', parsedData.error);
  } else {
    // get the string containing the ephemeris data
    const result = parsedData.data.result;
    return result;
  }
}

export async function getElements({
  bodyCode,
  centerCode = '500@10',
  referencePlane = 'ECLIPTIC',
}: EphemerisParams) {
  const text = await fetchEphemerides({
    bodyCode,
    centerCode,
    referencePlane,
    ephemerisType: 'ELEMENTS',
  });
}
export async function getVectors({
  bodyCode,
  centerCode = '500@10',
  referencePlane = 'ECLIPTIC',
}: EphemerisParams) {
  const text = await fetchEphemerides({
    bodyCode,
    centerCode,
    referencePlane,
    ephemerisType: 'VECTORS',
  });
}

export async function getEphemrides(
  bodyCode: string,
  centerCode?: string,
  referencePlane?: string
) {
  const elements = await getElements(bodyCode, centerCode, referencePlane);
  const vectors = await getVectors(bodyCode, centerCode, referencePlane);

  return {
    elements,
    vectors,
  };
}
