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
export function parseHorizons(text: string) {
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
  const eccentricityStr = text.match(/EC= (.*) QR=/)![1];
  const periapsisStr = text.match(/QR= (.*) IN=/)![1];
  const inclinationStr = text.match(/IN= (.*)/)![1];
  parsedData.eccentricity = parseFloat(eccentricityStr ?? '') ?? 0;
  parsedData.periapsis = parseFloat(periapsisStr ?? '') ?? 0;
  parsedData.inclination = parseFloat(inclinationStr ?? '') ?? 0;

  return parsedData;
}
