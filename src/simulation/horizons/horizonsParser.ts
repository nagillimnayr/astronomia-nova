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
  const elementsStr = text.match(/SOE([^]*)\$\$EOE/)![1];
  console.log('elementStr:', elementsStr);
  if (!elementsStr) {
    const errorMsg = 'error: no element data found';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // first line: EC QR IN
  const eccentricityStr = elementsStr.match(/EC\s*=\s*([^\s]*)\s/)![1];
  console.log('eccentricityStr:', eccentricityStr);
  parsedData.eccentricity = parseFloat(eccentricityStr ?? '') ?? 0;

  const periapsisStr = elementsStr.match(/QR\s*=\s*([^\s]*)\s/)![1];
  console.log('periapsisStr:', periapsisStr);
  parsedData.periapsis = parseFloat(periapsisStr ?? '') ?? 0;

  const inclinationStr = elementsStr.match(/IN\s*=\s*([^\s]*)\s/)![1];
  console.log('inclinationStr:', inclinationStr);
  parsedData.inclination = parseFloat(inclinationStr ?? '') ?? 0;

  // second line: OM W Tp
  const longitudeOfAscendingNodeStr =
    elementsStr.match(/OM\s*=\s*([^\s]*)\s/)![1];
  console.log('longitudeOfAscendingNodeStr:', longitudeOfAscendingNodeStr);
  parsedData.longitudeOfAscendingNode =
    parseFloat(longitudeOfAscendingNodeStr ?? '') ?? 0;

  const argumentOfPeriapsisStr = elementsStr.match(/W\s*=\s*([^\s]*)\s/)![1];
  console.log('argumentOfPeriapsisStr:', argumentOfPeriapsisStr);
  parsedData.argumentOfPeriapsis =
    parseFloat(argumentOfPeriapsisStr ?? '') ?? 0;

  const timeOfPeriapsisStr = elementsStr.match(/Tp\s*=\s*([^\s]*)\s/)![1];
  console.log('timeOfPeriapsisStr:', timeOfPeriapsisStr);
  parsedData.timeOfPeriapsis = parseFloat(timeOfPeriapsisStr ?? '') ?? 0;

  // third line: N MA TA
  const meanMotionStr = elementsStr.match(/N\s*=\s*([^\s]*)\s/)![1];
  console.log('meanMotionStr:', meanMotionStr);
  parsedData.meanMotion = parseFloat(meanMotionStr ?? '') ?? 0;

  const meanAnomalyStr = elementsStr.match(/MA\s*=\s*([^\s]*)\s/)![1];
  console.log('meanAnomalyStr:', meanAnomalyStr);
  parsedData.meanAnomaly = parseFloat(meanAnomalyStr ?? '') ?? 0;

  const trueAnomalyStr = elementsStr.match(/TA\s*=\s*([^\s]*)\s/)![1];
  console.log('trueAnomalyStr:', trueAnomalyStr);
  parsedData.trueAnomaly = parseFloat(trueAnomalyStr ?? '') ?? 0;

  // fourth line: A AD PR
  const semiMajorAxisStr = elementsStr.match(/A\s*=\s*([^\s]*)\s/)![1];
  console.log('semiMajorAxisStr:', semiMajorAxisStr);
  parsedData.semiMajorAxis = parseFloat(semiMajorAxisStr ?? '') ?? 0;

  const apoapsisStr = elementsStr.match(/AD\s*=\s*([^\s]*)\s/)![1];
  console.log('apoapsisStr:', apoapsisStr);
  parsedData.apoapsis = parseFloat(apoapsisStr ?? '') ?? 0;

  const siderealOrbitPeriodStr = elementsStr.match(/PR\s*=\s*([^\s]*)\s/)![1];
  console.log('siderealOrbitPeriodStr:', siderealOrbitPeriodStr);
  parsedData.siderealOrbitPeriod =
    parseFloat(siderealOrbitPeriodStr ?? '') ?? 0;

  return parsedData;
}
