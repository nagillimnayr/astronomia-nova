import { degToRad } from 'three/src/math/MathUtils';
import { getSemiLatusRectumFromEccentricity } from './axes/semi-latus-rectum';

export function getRadiusAtTrueAnomaly(
  trueAnomaly: number,
  semiMajorAxis: number,
  eccentricity: number
) {
  // Calculates the radius at a particular angle, using the elliptical formula
  // in polar form, relative to the right focus
  const semiLatusRectum = getSemiLatusRectumFromEccentricity(
    semiMajorAxis,
    eccentricity
  );
  const radius =
    semiLatusRectum / (1 + eccentricity * Math.cos(degToRad(trueAnomaly)));

  return radius;
}
