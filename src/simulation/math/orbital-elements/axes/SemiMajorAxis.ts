export const SemiMajorAxis = {
  getFromPeriapsis: getFromPeriapsis,

  getFromApoapsis: getFromApoapsis,
};

/**
 * @description
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} eccentricity
 * @param {number} periapsis
 * @returns {number} {number} semiMajorAxis
 */
function getFromPeriapsis(eccentricity: number, periapsis: number): number {
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
function getFromApoapsis(eccentricity: number, apoapsis: number): number {
  const semiMajorAxis = apoapsis / (1 + eccentricity);

  return semiMajorAxis;
}
