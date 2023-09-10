import { GRAV_CONST, PI_SQUARED } from '@/constants';

/**
 * @description
 * @param {number} eccentricity
 * @param {number} periapsis
 * @returns {number} {number} semiMajorAxis
 */
export function getFromPeriapsis(
  eccentricity: number,
  periapsis: number
): number {
  return periapsis / (1 - eccentricity);
}

/**
 * @description
 * @param {number} eccentricity
 * @param {number} apoapsis
 * @returns {number} {number} semiMajorAxis
 */
export function getSemiMajorAxisFromApoapsis(
  eccentricity: number,
  apoapsis: number
): number {
  return apoapsis / (1 + eccentricity);
}

export function getSemiMajorAxisFromLinearEccentricity(
  eccentricity: number,
  linearEccentricity: number
): number {
  return linearEccentricity / eccentricity;
}

export function getSemiMajorAxisFromSpecificOrbitalEnergy(
  centralMass: number,
  specificOrbitalEnergy: number
): number {
  //scale distance
  return -(GRAV_CONST * (centralMass / (2.0 * specificOrbitalEnergy)));
}

/**
 * @summary Calculate the semi-major axis from the orbital period and the mass
 *   of the central body.
 *
 * @description
 * $\displaystyle a = \sqrt[3]{\frac{GM T^2}{4\pi^2}}$
 * @param {number} period
 * @param {number} centralMass
 * @returns {*}  {number} semiMajorAxis
 */
export function getSemiMajorAxisFromPeriod(
  period: number,
  centralMass: number
): number {
  // cube root of (G*M * T^2) / (4PI^2)
  return Math.pow(
    (GRAV_CONST * centralMass * period ** 2) / (4.0 * PI_SQUARED),
    1 / 3
  );
}

/**
 * @description
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
 * @export
 * @param {number} semiLatusRectum
 * @param {number} eccentricity
 * @returns {number} semi-major axis
 */
export function getSemiMajorAxisFromSemiLatusRectum(
  semiLatusRectum: number,
  eccentricity: number
): number {
  return semiLatusRectum / (1 - eccentricity ** 2);
}
