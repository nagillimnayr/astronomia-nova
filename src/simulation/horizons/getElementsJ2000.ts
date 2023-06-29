import fs from 'fs-extra';
import { parseHorizonsElements } from './parseHorizonsElements';
import { ElementCode, ALL_ELEMENT_CODES } from './elementCodes';
import url from './horizonsURL';
import { z } from 'zod';

const format = 'json';
const OBJ_DATA = 'NO';
const MAKE_EPHEM = 'YES';
const EPHEM_TYPE = 'ELEMENTS';

// const CENTER = '500@10';
const REF_PLANE = 'ECLIPTIC';
const TLIST = `'2000-Jan-01%2012:00:00'`;
const CSV_FORMAT = 'NO';

const horizonsSchema = z.object({
  result: z.string(),
  signature: z.object({
    version: z.string(),
    source: z.string(),
  }),
});

type Options = {
  bodyCode: string;
  centerCode?: string;
  elementCodes?: ReadonlyArray<ElementCode>;
};

export async function getElementsJ2000(options: Options) {
  const COMMAND = options.bodyCode;
  const CENTER = options.centerCode ?? '500@10'; // if not defined, set default as the Sun
  const elementCodes = options.elementCodes ?? ALL_ELEMENT_CODES; // if not defined, set default as all codes

  const query = `${url}?format=${format}&COMMAND=${COMMAND}&OBJ_DATA=${OBJ_DATA}&MAKE_EPHEM=${MAKE_EPHEM}&EPHEM_TYPE=${EPHEM_TYPE}&CENTER=${CENTER}&REF_PLANE=${REF_PLANE}&TLIST=${TLIST}&CSV_FORMAT=${CSV_FORMAT}`;

  try {
    const response = await fetch(query);
    const text = await response.text();
    const parsedData = horizonsSchema.safeParse(JSON.parse(text));
    if (!parsedData.success) {
      console.error('error:', parsedData.error);
    } else {
      // get the string containing the ephemeris data
      const result = parsedData.data.result;
      // parse the string and extract the elements

      const elements = parseHorizonsElements(result);
      console.log(elements);
      return elements;
    }
  } catch (e) {
    console.error(e);
  }
}
