/**
 * @summary
 * @description
 * $$ \displaystyle M = l - \varpi $$
 *
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
