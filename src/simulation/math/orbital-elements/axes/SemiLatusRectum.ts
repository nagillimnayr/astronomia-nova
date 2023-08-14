import { type Vector3 } from 'three';

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

/**
 * @description
 * $$ \displaystyle p = \frac{h^2}{\mu} $$
 *
 * @author Ryan Milligan
 * @date 25/07/2023
 * @export
 * @param {Vector3} specificAngularMomentum
 * @param {number} gravitationalParameter
 * @returns {*}
 */
export function getSemiLatusRectumFromAngularMomentum(
  specificAngularMomentum: Vector3,
  gravitationalParameter: number
) {
  const semiLatusRectum =
    specificAngularMomentum.dot(specificAngularMomentum) /
    gravitationalParameter;
  return semiLatusRectum;
}
