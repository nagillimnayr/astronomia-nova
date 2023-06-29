import { ALL_ELEMENT_CODES, ElementCode } from './elementCodes';

export type Elements = {
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

export function parseElement(text: string, elementCode: Readonly<ElementCode>) {
  // const regexp = new RegExp('\s*=\s*([^\s]*)\s');
  const str = `${elementCode}\\s*=\\s*([^\\s]*)\\s`;
  console.log(str);
  const regexp = new RegExp(str);
  const matches = text.match(regexp);
  if (!matches || matches.length < 2 || !matches[1]) {
    console.error('no match found');
    return 0;
  }
  const element = parseFloat(matches[1]) ?? 0;
  return element;
}

export function parseHorizonsElements(text: Readonly<string>): Elements {
  // get text with elements data
  const elementsStr = text.match(/SOE([^]*)\$\$EOE/)![1];
  console.log('elementStr:', elementsStr);
  if (!elementsStr) {
    const errorMsg = 'error: no element data found';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return {
    eccentricity: parseElement(elementsStr, 'EC'),
    periapsis: parseElement(elementsStr, 'QR'),
    inclination: parseElement(elementsStr, 'IN'),
    longitudeOfAscendingNode: parseElement(elementsStr, 'OM'),
    argumentOfPeriapsis: parseElement(elementsStr, 'W'),
    timeOfPeriapsis: parseElement(elementsStr, 'Tp'),
    meanMotion: parseElement(elementsStr, 'N'),
    meanAnomaly: parseElement(elementsStr, 'MA'),
    trueAnomaly: parseElement(elementsStr, 'TA'),
    semiMajorAxis: parseElement(elementsStr, 'A'),
    apoapsis: parseElement(elementsStr, 'AD'),
    siderealOrbitPeriod: parseElement(elementsStr, 'PR'),
  };
}
