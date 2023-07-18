/**
 * @summary
 * @description
 * $$ \displaystyle M = l - \varpi $$
 *
 * @author Ryan Milligan
 * @date 21/06/2023
 * @param {number} meanLongitude (deg)
 * @param {number} longitudeOfPeriapsis (deg)
 * @returns {*} {number} meanAnomaly
 */
export const getMeanAnomalyFromMeanLongitude = (
  meanLongitude: number,
  longitudeOfPeriapsis: number
) => {
  const meanAnomaly = meanLongitude - longitudeOfPeriapsis;
  return meanAnomaly;
};
