import { degToRad } from 'three/src/math/MathUtils';
import { getSemiLatusRectumFromEccentricity } from './axes/SemiLatusRectum';

export function getRadiusAtTrueAnomaly(
  trueAnomaly: number,
  semiMajorAxis: number,
  eccentricity: number
) {
  const semiLatusRectum = getSemiLatusRectumFromEccentricity(
    semiMajorAxis,
    eccentricity
  );
  const radius =
    semiLatusRectum / (1 + eccentricity * Math.cos(degToRad(trueAnomaly)));

  return radius;
}
