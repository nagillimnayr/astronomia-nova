import { type Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import { getRadiusAtTrueAnomaly } from '../orbital-elements/orbital-radius';

export function getPositionFromRadius(
  radius: number,
  trueAnomaly: number,
  outVector: Vector3
): Vector3 {
  // Convert polar coordinates to cartesian coordinates.
  const radians = trueAnomaly;
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);

  // Swizzle the vector so that it lies in the XZ plane, rather than the XY plane.
  outVector.set(x, 0, -y);
  return outVector;
}

export function getPositionAtTrueAnomaly(
  trueAnomaly: number,
  semiMajorAxis: number,
  eccentricity: number,
  outVector: Vector3
): Vector3 {
  // Compute the radius at the true anomaly.
  const radius = getRadiusAtTrueAnomaly(
    trueAnomaly,
    semiMajorAxis,
    eccentricity
  );
  return getPositionFromRadius(radius, trueAnomaly, outVector);
}
