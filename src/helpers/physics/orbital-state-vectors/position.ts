import { type Vector3 } from 'three';
import { getRadiusAtTrueAnomaly } from '../orbital-elements/orbital-radius';

export function getPositionFromRadius(
  radius: number,
  trueAnomaly: number, // Radians.
  outVector: Vector3
): Vector3 {
  // Convert polar coordinates to cartesian coordinates.
  const x = radius * Math.cos(trueAnomaly);
  const y = radius * Math.sin(trueAnomaly);

  // Swizzle the vector so that it lies in the XZ plane, rather than the XY plane.
  outVector.set(x, 0, -y);
  return outVector;
}

export function getPositionAtTrueAnomaly(
  trueAnomaly: number, // Radians.
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

export function getPositionAtEccentricAnomaly(
  semiMajorAxis: number,
  eccentricity: number,
  eccentricAnomaly: number,
  outVector: Vector3
) {
  const x = semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
  const y =
    semiMajorAxis *
    Math.sin(eccentricAnomaly) *
    Math.sqrt(1 - eccentricity ** 2);

  return outVector.set(x, 0, -y);
}
