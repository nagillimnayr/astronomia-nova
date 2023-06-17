import { square } from 'mathjs';

const fromEccentricity = (semiMajorAxis: number, eccentricity: number) => {
  return semiMajorAxis * (1.0 - square(eccentricity));
};
const fromApsides = (apoapsis: number, periapsis: number) => {
  return (2.0 * apoapsis * periapsis) / (apoapsis + periapsis);
};

export const SemiLatusRectum = {
  fromEccentricity,
  fromApsides,
};
