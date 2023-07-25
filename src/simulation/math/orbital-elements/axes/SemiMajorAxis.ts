import { nthRoot } from 'mathjs';
import { GRAV_CONST, PI_SQUARED } from '@/simulation/utils/constants';

/**
 * @description
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} eccentricity
 * @param {number} periapsis
 * @returns {number} {number} semiMajorAxis
 */
export function getFromPeriapsis(
  eccentricity: number,
  periapsis: number
): number {
  const semiMajorAxis = periapsis / (1 - eccentricity);

  return semiMajorAxis;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} eccentricity
 * @param {number} apoapsis
 * @returns {number} {number} semiMajorAxis
 */
export function getSemiMajorAxisFromApoapsis(
  eccentricity: number,
  apoapsis: number
): number {
  const semiMajorAxis = apoapsis / (1 + eccentricity);

  return semiMajorAxis;
}

export function getSemiMajorAxisFromLinearEccentricity(
  eccentricity: number,
  linearEccentricity: number
) {
  return linearEccentricity / eccentricity;
}

export function getSemiMajorAxisFromSpecificOrbitalEnergy(
  centralMass: number,
  specificOrbitalEnergy: number
) {
  const semiMajorAxis = -(
    GRAV_CONST *
    (centralMass / (2.0 * specificOrbitalEnergy))
  ); //scale distance
  return semiMajorAxis;
}

/**
 * @summary Calculate the semi-major axis from the orbital period and the mass of the central body.
 *
 * @description
 * $\displaystyle a = \sqrt[3]{\frac{GM T^2}{4\pi^2}}$
 *
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} period
 * @param {number} centralMass
 * @returns {*}  {number} semiMajorAxis
 */
export function getSemiMajorAxisFromPeriod(
  period: number,
  centralMass: number
): number {
  // cube root of (G*M * T^2) / (4PI^2)
  const semiMajorAxis = nthRoot(
    (GRAV_CONST * centralMass * period ** 2) / (4.0 * PI_SQUARED),
    3
  ) as number;
  return semiMajorAxis;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} apoapsis
 * @param {number} periapsis
 * @returns {*} {number} semiMajorAxis
 */
export function getSemiMajorAxisFromApsides(
  apoapsis: number,
  periapsis: number
) {
  return (periapsis + apoapsis) / 2.0;
}

/**
 * @description
 *
 *
 * @author Ryan Milligan
 * @date 25/07/2023
 * @export
 * @param {number} semiLatusRectum
 * @param {number} eccentricity
 * @returns {*}
 */
export function getSemiMajorAxisFromSemiLatusRectum(
  semiLatusRectum: number,
  eccentricity: number
) {
  return semiLatusRectum / (1 - eccentricity ** 2);
}
