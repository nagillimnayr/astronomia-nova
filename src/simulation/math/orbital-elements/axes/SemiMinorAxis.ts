import { sqrt } from 'mathjs';

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis (meters)
 * @param {number} semiLatusRectum (meters)
 * @returns {*}  {number} semiMinorAxis (m)
 */
const fromSemiLatusRectum = (
  semiMajorAxis: number,
  semiLatusRectum: number
): number => {
  return sqrt(semiMajorAxis * semiLatusRectum) as number;
};

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} apoapsis (meters)
 * @param {number} periapsis (meters)
 * @returns {*}  {number} semiMinorAxis (m)
 */
const fromApsides = (apoapsis: number, periapsis: number): number => {
  return sqrt(apoapsis * periapsis) as number;
};

export const SemiMinorAxis = {
  fromSemiLatusRectum,
  fromApsides,
};
