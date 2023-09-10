/**
 * @description $\displaystyle b = \sqrt{a\ell}$
 *
 * @param {number} semiMajorAxis (meters)
 * @param {number} semiLatusRectum (meters)
 * @returns {*}  {number} semiMinorAxis (m)
 */
export function getSemiMinorAxisFromSemiLatusRectum(
  semiMajorAxis: number,
  semiLatusRectum: number
): number {
  return Math.sqrt(semiMajorAxis * semiLatusRectum);
}

/**
 * @description
 *
 * @param {number} apoapsis (meters)
 * @param {number} periapsis (meters)
 * @returns {*}  {number} semiMinorAxis (m)
 */
export function getSemiMinorAxisFromApsides(
  apoapsis: number,
  periapsis: number
): number {
  return Math.sqrt(apoapsis * periapsis);
}
