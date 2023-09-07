import { GRAV_CONST } from '../../../constants/constants';

export function calculateOrbitalPeriod(
  semiMajorAxis: number,
  centralMass: number
) {
  const period =
    2 * Math.PI * Math.sqrt(semiMajorAxis ** 3 / (GRAV_CONST * centralMass));

  return period;
}
