export const getSemiLatusRectumFromEccentricity = (
  semiMajorAxis: number,
  eccentricity: number
) => {
  return semiMajorAxis * (1.0 - eccentricity ** 2);
};
export const getSemiLatusRectumFromApsides = (
  apoapsis: number,
  periapsis: number
) => {
  return (2.0 * apoapsis * periapsis) / (apoapsis + periapsis);
};
