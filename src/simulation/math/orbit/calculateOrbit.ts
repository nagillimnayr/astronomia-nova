import { SpecificOrbitalEnergy } from '../orbital-elements/SpecificOrbitalEnergy';
import { Apoapsis } from '../orbital-elements/apsides/Apoapsis';
import { SemiMajorAxis } from '../orbital-elements/axes/SemiMajorAxis';
import { LinearEccentricity } from '../orbital-elements/LinearEccentricity';
import { Eccentricity } from '../orbital-elements/Eccentricity';
import { SemiLatusRectum } from '../orbital-elements/axes/SemiLatusRectum';
import { SemiMinorAxis } from '../orbital-elements/axes/SemiMinorAxis';

export const calculateOrbitFromPeriapsis = (
  periapsis: number,
  maxOrbitalSpeed: number,
  centralMass: number
) => {
  // calculate specificOrbitalEnergy
  const specificOrbitalEnergy = SpecificOrbitalEnergy.calculate(
    maxOrbitalSpeed,
    centralMass,
    periapsis
  );

  // calculate semiMajorAxis
  const semiMajorAxis = SemiMajorAxis.getFromSpecificOrbitalEnergy(
    centralMass,
    specificOrbitalEnergy
  );

  // calculate apoapsis
  const apoapsis = Apoapsis.fromPeriapsis(semiMajorAxis, periapsis);

  // linear eccentricity
  const linearEccentricity = LinearEccentricity.fromApsis(
    semiMajorAxis,
    apoapsis
  );

  // eccentricity
  const eccentricity = Eccentricity.fromLinearEccentricity(
    semiMajorAxis,
    linearEccentricity
  );

  // semiLatusRectum
  const semiLatusRectum = SemiLatusRectum.fromEccentricity(
    semiMajorAxis,
    eccentricity
  );

  // semiMinorAxis
  const semiMinorAxis = SemiMinorAxis.fromSemiLatusRectum(
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
