import { type Vector3Tuple } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { getRadiusAtTrueAnomaly } from './OrbitalRadius';

export function getPositionFromRadius(
  radius: number,
  trueAnomaly: number
): Vector3Tuple {
  // convert polar coordinates to cartesian coordinates
  const radians = degToRad(trueAnomaly);
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);

  return [x, -y, 0]; // -y so that it is rotated around counter-clockwise around the z-axis
}

export function getPosition(
  trueAnomaly: number,
  semiMajorAxis: number,
  eccentricity: number
): Vector3Tuple {
  const radius = getRadiusAtTrueAnomaly(
    trueAnomaly,
    semiMajorAxis,
    eccentricity
  );
  return getPositionFromRadius(radius, trueAnomaly);
}
