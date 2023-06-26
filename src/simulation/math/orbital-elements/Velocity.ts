// The velocity of the orbiting body can be determined with the 'vis-viva' equation
// $$ \displaystyle |\vec{v}| = \sqrt{GM \left( \frac{2}{r} - \frac{1}{a} \right)} $$

import { GRAV_CONST } from '~/simulation/utils/constants';

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
