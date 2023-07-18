// The velocity of the orbiting body can be determined with the 'vis-viva' equation
// $$ \displaystyle |\vec{v}| = \sqrt{GM \left( \frac{2}{r} - \frac{1}{a} \right)} $$

import { degToRad } from 'three/src/math/MathUtils';
import { GRAV_CONST } from '@/simulation/utils/constants';
import { Vector3 } from 'three';

/**
 * @summary
 *
 * @description
 * Vis-viva equation:
 * $$ \displaystyle |\vec{v}| = \sqrt{GM \left( \frac{2}{r} - \frac{1}{a} \right)} $$
 *
 * @author Ryan Milligan
 * @date 26/06/2023
 * @export
 * @param {number} radius
 * @param {number} centralMass
 * @param {number} semiMajorAxis
 * @returns {*}  {number} orbitalSpeed
 */
export function getOrbitalSpeedFromRadius(
  radius: number,
  centralMass: number,
  semiMajorAxis: number
): number {
  const orbitalSpeed = Math.sqrt(
    GRAV_CONST * centralMass * (2 / radius - 1 / semiMajorAxis)
  );

  return orbitalSpeed;
}

export function getVelocityDirectionAtRadius(
  radius: number,
  trueAnomaly: number,
  semiMajorAxis: number,
  semiMinorAxis: number
): Vector3 {
  // get the radius relative to the center of the ellipse

  // parameterize to get the x, y coordinates at radius
  const radians = degToRad(trueAnomaly);
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);

  // get the direction vector of the tangent line of the ellipse at the point (x, y)
  const dirX = -y * semiMajorAxis ** 2;
  const dirY = x * semiMinorAxis ** 2;

  const velocityDirection = new Vector3(dirX, 0, -dirY).normalize();
  return velocityDirection;
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
 * The velocity is the derivative of the position.
 *
 *
 * @author Ryan Milligan
 * @date 29/06/2023
 * @export
 * @param {number} trueAnomaly
 * @param {number} eccentricity
 * @returns {*}  {Vector3}
 */
export function getVelocityDirectionFromOrbitalElements(
  trueAnomaly: number,
  eccentricity: number
): Vector3 {
  const trueAnomalyRadians = degToRad(trueAnomaly);
  const vx = -Math.sin(trueAnomalyRadians);
  const vy = eccentricity + Math.cos(trueAnomalyRadians);

  return new Vector3(vx, 0, -vy).normalize();
}
