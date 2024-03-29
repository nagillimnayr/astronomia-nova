import { type Vector3 } from 'three';
import { GRAV_CONST } from '@/constants';

/**
 * @summary
 *
 * @description
 * Vis-viva equation:
 * $$ \displaystyle |\vec{v}| = \sqrt{GM \left( \frac{2}{r} - \frac{1}{a}
 *   \right)} $$
 *
 * @param {number} radius
 * @param {number} centralMass
 * @param {number} semiMajorAxis
 * @returns {number}  {number} orbitalSpeed
 */
export function getOrbitalSpeedFromRadius(
  radius: number,
  centralMass: number,
  semiMajorAxis: number
): number {
  return Math.sqrt(GRAV_CONST * centralMass * (2 / radius - 1 / semiMajorAxis));
}

/**
 * https://orbital-mechanics.space/classical-orbital-elements/orbital-elements-and-the-state-vector.html#orbital-elements-state-vector
 *
 * */

/**
 * @summary Get the direction of the velocity vector
 * at an arbitrary point from the true anomaly and the
 * eccentricity.
 *
 *
 * @description
 * https://orbital-mechanics.space/classical-orbital-elements/perifocal-frame.html#equation-eq-perifocal-simplified-velocity-vector#equation-eq-perifocal-simplified-velocity-vector
 *
 * @export
 * @param {number} trueAnomaly in radians.
 * @param {number} eccentricity
 * @param {Vector3} outVector
 * @returns {Vector3} {Vector3}
 */
export function getVelocityDirectionFromOrbitalElements(
  trueAnomaly: number, // Radians.
  eccentricity: number,
  outVector: Vector3
): Vector3 {
  const vx = -Math.sin(trueAnomaly);
  const vy = eccentricity + Math.cos(trueAnomaly);

  // Swizzle the vector so that it is in the XZ plane.
  outVector.set(vx, 0, -vy);
  // return outVector.normalize();
  return outVector;
}

export function computeVelocityVector(
  trueAnomaly: number, // Radians.
  eccentricity: number,
  centralMass: number,
  specificAngularMomentum: number,
  outVector: Vector3
) {
  const vx = -Math.sin(trueAnomaly);
  const vy = eccentricity + Math.cos(trueAnomaly);
  outVector
    .set(vx, 0, -vy)
    .multiplyScalar((GRAV_CONST * centralMass) / specificAngularMomentum);
  return outVector;
}
