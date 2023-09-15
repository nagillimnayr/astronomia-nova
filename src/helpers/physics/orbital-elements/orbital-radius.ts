import { getSemiLatusRectumFromEccentricity } from './axes/semi-latus-rectum';

export function getRadiusAtTrueAnomaly(
  trueAnomaly: number, // Radians.
  semiMajorAxis: number,
  eccentricity: number
) {
  // Calculates the radius at a particular angle, using the elliptical formula
  // in polar form, relative to the right focus
  const semiLatusRectum = getSemiLatusRectumFromEccentricity(
    semiMajorAxis,
    eccentricity
  );
  return semiLatusRectum / (1 + eccentricity * Math.cos(trueAnomaly));
}
