import { sqrt, square } from 'mathjs';
import { Vector3 } from 'three';
import { GRAV_CONST } from '~/simulation/utils/constants';

const fromLinearEccentricity = (
  semiMajorAxis: number,
  linearEccentricity: number
) => {
  return linearEccentricity / semiMajorAxis;
};

const fromAxes = (semiMajorAxis: number, semiMinorAxis: number) => {
  return sqrt(1.0 - square(semiMinorAxis) / square(semiMajorAxis));
};

const fromSpecificAngularMomentum = (
  specificOrbitalEnergy: number,
  centralMass: number,
  specificAngularMomentum: Vector3
) => {
  return sqrt(
    1.0 +
      (2.0 * specificOrbitalEnergy * square(specificAngularMomentum.length())) /
        square(GRAV_CONST * centralMass)
  );
};

const fromApsides = (apoapsis: number, periapsis: number) => {
  return (apoapsis - periapsis) / (apoapsis + periapsis);
};

export const Eccentricity = {
  fromLinearEccentricity,
  fromAxes,
  fromSpecificAngularMomentum,
  fromApsides,
};
