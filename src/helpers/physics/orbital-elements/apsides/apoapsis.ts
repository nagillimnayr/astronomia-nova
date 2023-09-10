/**
 *
 * @param {number} semiMajorAxis
 * @param {number} eccentricity
 * @returns {number} apoapsis
 */
export function getApoapsisFromEccentricity(
  semiMajorAxis: number,
  eccentricity: number
): number {
  return (1.0 + eccentricity) * semiMajorAxis;
}

/**
 *
 * @param {number} semiMajorAxis
 * @param {number} periapsis
 * @returns {number} apoapsis
 */
export function getApoapsisFromPeriapsis(
  semiMajorAxis: number,
  periapsis: number
): number {
  return 2.0 * semiMajorAxis - periapsis;
}
