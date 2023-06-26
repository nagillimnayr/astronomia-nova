export function getSemiLatusRectumFromEccentricity(
  semiMajorAxis: number,
  eccentricity: number
) {
  return semiMajorAxis * (1.0 - eccentricity ** 2);
}

/**
 * @description
 * @author Ryan Milligan
 * @date 26/06/2023
 * @export
 * @param {number} apoapsis
 * @param {number} periapsis
 * @returns {*}
 */
export function getSemiLatusRectumFromApsides(
  apoapsis: number,
  periapsis: number
) {
  return (2.0 * apoapsis * periapsis) / (apoapsis + periapsis);
}
