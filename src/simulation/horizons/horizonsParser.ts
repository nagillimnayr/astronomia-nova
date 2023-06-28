type Elements = {
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
export function parseHorizonsElements(text: string) {
  const parsedData: Elements = {
    eccentricity: 0,
    periapsis: 0,
    inclination: 0,
    longitudeOfAscendingNode: 0,
    argumentOfPeriapsis: 0,
    timeOfPeriapsis: 0,
    meanMotion: 0,
    meanAnomaly: 0,
    trueAnomaly: 0,
    semiMajorAxis: 0,
    apoapsis: 0,
    siderealOrbitPeriod: 0,
  };

  // get text with elements data
  const elementsStr = text.match(/$$SOE(.*)$$EOE/)![1];
  if (!elementsStr) {
    console.error('error: no element data found');
  }

  const eccentricityStr = elementsStr.match(/EC= (.*) QR=/)![1];
  parsedData.eccentricity = parseFloat(eccentricityStr ?? '') ?? 0;

  const periapsisStr = elementsStr.match(/QR= (.*) IN=/)![1];
  parsedData.periapsis = parseFloat(periapsisStr ?? '') ?? 0;

  const inclinationStr = elementsStr.match(/IN= (.*)/)![1];
  parsedData.inclination = parseFloat(inclinationStr ?? '') ?? 0;

  return parsedData;
}
