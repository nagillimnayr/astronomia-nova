import { getSpecificOrbitalEnergy } from '../orbital-elements/SpecificOrbitalEnergy';
import { getApoapsisFromPeriapsis } from '../orbital-elements/apsides/Apoapsis';
import { getSemiMajorAxisFromSpecificOrbitalEnergy } from '../orbital-elements/axes/SemiMajorAxis';
import { getLinearEccentricityFromApsis } from '../orbital-elements/LinearEccentricity';
import { getEccentricityFromLinearEccentricity } from '../orbital-elements/Eccentricity';
import { getSemiLatusRectumFromEccentricity } from '../orbital-elements/axes/SemiLatusRectum';
import { getSemiMinorAxisFromSemiLatusRectum } from '../orbital-elements/axes/SemiMinorAxis';

export const calculateOrbitFromPeriapsis = (
  periapsis: number,
  maxOrbitalSpeed: number,
  centralMass: number
) => {
  // calculate specificOrbitalEnergy
  const specificOrbitalEnergy = getSpecificOrbitalEnergy(
    maxOrbitalSpeed,
    centralMass,
    periapsis
  );

  // calculate semiMajorAxis
  const semiMajorAxis = getSemiMajorAxisFromSpecificOrbitalEnergy(
    centralMass,
    specificOrbitalEnergy
  );

  // calculate apoapsis
  const apoapsis = getApoapsisFromPeriapsis(semiMajorAxis, periapsis);

  // linear eccentricity
  const linearEccentricity = getLinearEccentricityFromApsis(
    semiMajorAxis,
    apoapsis
  );

  // eccentricity
  const eccentricity = getEccentricityFromLinearEccentricity(
    semiMajorAxis,
    linearEccentricity
  );

  // semiLatusRectum
  const semiLatusRectum = getSemiLatusRectumFromEccentricity(
    semiMajorAxis,
    eccentricity
  );

  // semiMinorAxis
  const semiMinorAxis = getSemiMinorAxisFromSemiLatusRectum(
    semiMajorAxis,
    semiLatusRectum
  );

  // console.log('periapsis: ', periapsis);
  // console.log('apoapsis: ', apoapsis);
  // console.log('semiMajorAxis: ', semiMajorAxis);
  // console.log('semiMinorAxis: ', semiMinorAxis);
  // console.log('semiLatusRectum: ', semiLatusRectum);
  // console.log('specificOrbitalEnergy: ', specificOrbitalEnergy);
  // console.log('eccentricity: ', eccentricity);
  // console.log('linearEccentricity: ', linearEccentricity);

  return {
    periapsis,
    apoapsis,
    semiMajorAxis,
    semiMinorAxis,
    semiLatusRectum,
    specificOrbitalEnergy,
    eccentricity,
    linearEccentricity,
  };
};
