/**
 * @summary Calculate orbital radius at periapsis from the Semi-major axis and the Eccentricity.
 *
 * @description
 *
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} eccentricity
 * @returns {*}
 */
const fromEccentricity = (semiMajorAxis: number, eccentricity: number) => {
  return (1.0 - eccentricity) * semiMajorAxis;
};

/**
 * @summary The length of the orbital radius at periapsis is the length of the major axis - the length of the radius at apoapsis.
 *
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} apoapsis
 * @returns {*}
 */
const fromApoapsis = (semiMajorAxis: number, apoapsis: number) => {
  return 2.0 * semiMajorAxis - apoapsis;
};

export const Periapsis = {
  fromEccentricity,
  fromApoapsis,
};
