const fromEccentricity = (semiMajorAxis: number, eccentricity: number) => {
  const apoapsis = (1.0 + eccentricity) * semiMajorAxis;
  return apoapsis;
};

const fromPeriapsis = (semiMajorAxis: number, periapsis: number) => {
  const apoapsis = 2.0 * semiMajorAxis - periapsis;
  return apoapsis;
};

export const Apoapsis = {
  fromEccentricity,
  fromPeriapsis,
};
