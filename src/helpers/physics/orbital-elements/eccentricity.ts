import { GRAV_CONST } from '@/constants/constants';
import { Vector3 } from 'three';

export function getEccentricityFromLinearEccentricity(
  semiMajorAxis: number,
  linearEccentricity: number
) {
  return linearEccentricity / semiMajorAxis;
}

export function getEccentricityFromAxes(
  semiMajorAxis: number,
  semiMinorAxis: number
) {
  return Math.sqrt(1.0 - semiMinorAxis ** 2 / semiMajorAxis ** 2);
}

export function getEccentricityFromSpecificAngularMomentum(
  specificOrbitalEnergy: number,
  centralMass: number,
  specificAngularMomentum: Vector3
) {
  return Math.sqrt(
    1.0 +
      (2.0 * specificOrbitalEnergy * specificAngularMomentum.length() ** 2) /
        (GRAV_CONST * centralMass) ** 2
  );
}

export function getEccentricityFromApsides(
  apoapsis: number,
  periapsis: number
) {
  return (apoapsis - periapsis) / (apoapsis + periapsis);
}

const _eccentricityVector = new Vector3();
const _posNormalized = new Vector3();

export function calculateEccentricityVector(
  position: Vector3,
  velocity: Vector3,
  gravitationalParameter: number,
  specificAngularMomentum: Vector3
) {
  _posNormalized.copy(position).normalize();
  _eccentricityVector
    .crossVectors(velocity, specificAngularMomentum)
    .multiplyScalar(1 / gravitationalParameter)
    .sub(_posNormalized);

  return _eccentricityVector.toArray();
}
