export function getApoapsisFromEccentricity(
  semiMajorAxis: number,
  eccentricity: number
) {
  const apoapsis = (1.0 + eccentricity) * semiMajorAxis;
  return apoapsis;
}

export function getApoapsisFromPeriapsis(
  semiMajorAxis: number,
  periapsis: number
) {
  const apoapsis = 2.0 * semiMajorAxis - periapsis;
  return apoapsis;
}
