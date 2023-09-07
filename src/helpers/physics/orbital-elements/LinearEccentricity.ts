/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} eccentricity
 * @returns {*}
 */
export function getLinearEccentricityFromEccentricity(
  semiMajorAxis: number,
  eccentricity: number
) {
  return semiMajorAxis * eccentricity;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} apsis
 * @returns {*}
 */
export function getLinearEccentricityFromApsis(
  semiMajorAxis: number,
  apsis: number
) {
  // Linear eccentricity is the distance between the center of the ellipse and
  // either of the foci, it can be calculated either from (semiMajorAxis -
  // periapsis) or from (apoapsis - semiMajorAxis)
  return semiMajorAxis > apsis ? semiMajorAxis - apsis : apsis - semiMajorAxis;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} apoapsis
 * @returns {*}
 */
export function getLinearEccentricityFromApoapsis(
  semiMajorAxis: number,
  apoapsis: number
) {
  console.assert(
    semiMajorAxis <= apoapsis,
    'the semi-major axis should be smaller than the apoapsis'
  );

  return apoapsis - semiMajorAxis;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} periapsis
 * @returns {*}
 */
export function getLinearEccentricityFromPeriapsis(
  semiMajorAxis: number,
  periapsis: number
) {
  console.assert(
    semiMajorAxis >= periapsis,
    'the semi-major axis should be larger than the periapsis'
  );
  return semiMajorAxis - periapsis;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 * @param {number} semiMajorAxis
 * @param {number} semiMinorAxis
 * @returns {*}
 */
export function getLinearEccentricityFromAxes(
  semiMajorAxis: number,
  semiMinorAxis: number
) {
  return Math.sqrt(
    semiMajorAxis * semiMajorAxis - semiMinorAxis * semiMinorAxis
  );
}
