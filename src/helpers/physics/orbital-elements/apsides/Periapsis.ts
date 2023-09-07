/**
 * @summary Calculate orbital radius at periapsis from the Semi-major axis and
 *   the Eccentricity.
 *
 * @description
 *
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} eccentricity
 * @returns {*}
 */
export function getPeriapsisFromEccentricity(
  semiMajorAxis: number,
  eccentricity: number
) {
  return (1.0 - eccentricity) * semiMajorAxis;
}

/**
 * @summary The length of the orbital radius at periapsis is the length of the
 *   major axis - the length of the radius at apoapsis.
 *
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} apoapsis
 * @returns {*}
 */
export function getPeriapsisFromApoapsis(
  semiMajorAxis: number,
  apoapsis: number
) {
  return 2.0 * semiMajorAxis - apoapsis;
}
