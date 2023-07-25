import { getSpecificOrbitalEnergy } from '../orbital-elements/SpecificOrbitalEnergy';
import {
  getApoapsisFromEccentricity,
  getApoapsisFromPeriapsis,
} from '../orbital-elements/apsides/Apoapsis';
import {
  getSemiMajorAxisFromSemiLatusRectum,
  getSemiMajorAxisFromSpecificOrbitalEnergy,
} from '../orbital-elements/axes/SemiMajorAxis';
import { getLinearEccentricityFromApsis } from '../orbital-elements/LinearEccentricity';
import {
  calculateEccentricityVector,
  getEccentricityFromLinearEccentricity,
} from '../orbital-elements/Eccentricity';
import {
  getSemiLatusRectumFromEccentricity,
  getSemiLatusRectumFromAngularMomentum,
} from '../orbital-elements/axes/SemiLatusRectum';
import { getSemiMinorAxisFromSemiLatusRectum } from '../orbital-elements/axes/SemiMinorAxis';
import { Vector3 } from 'three';
import { calculateSpecificAngularMomentum } from '../orbital-elements/specificAngularMomentum';
import { GRAV_CONST } from '@/simulation/utils/constants';
import {
  calculateAscendingNode,
  calculateLongitudeOfAscendingNode,
} from '../orbital-elements/ascendingNode';
import { calculateInclination } from '../orbital-elements/inclination';
import { calculateArgumentOfPeriapsis } from '../orbital-elements/argumentOfPeriapsis';
import { calculateTrueAnomaly } from '../orbital-elements/anomalies/TrueAnomaly';
import { getPosition } from '../orbital-elements/Position';
import { getVelocityVector } from '../orbital-state-vectors/velocityVector';
import { getPeriapsisFromEccentricity } from '../orbital-elements/apsides/Periapsis';

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

const _xAxis = Object.freeze(new Vector3(1, 0, 0));
const _yAxis = Object.freeze(new Vector3(0, 1, 0));
const _zAxis = Object.freeze(new Vector3(0, 0, 1));
const _pos = new Vector3();
const _vel = new Vector3();
const _specificAngularMomentum = new Vector3();
const _ascendingNode = new Vector3();
const _eccentricityVector = new Vector3();
export const calculateOrbitFromStateVectors = (
  position: Vector3,
  velocity: Vector3,
  centralMass: number,
  orbitingMass: number
) => {
  const orbitalDistance = position.length();
  const orbitalSpeed = velocity.length();
  const gravParam = centralMass * GRAV_CONST;

  // Calculate specific angular momentum.
  _specificAngularMomentum.set(
    ...calculateSpecificAngularMomentum(position, velocity)
  );

  // Calculate specific orbital energy.
  const _specificOrbitalEnergy = getSpecificOrbitalEnergy(
    orbitalSpeed,
    centralMass,
    orbitalDistance
  );

  // Calculate ascending node.
  _ascendingNode.set(
    ...calculateAscendingNode(_specificAngularMomentum, _zAxis)
  );

  // Calculate eccentricity vector.
  _eccentricityVector.set(
    ...calculateEccentricityVector(
      position,
      velocity,
      gravParam,
      _specificAngularMomentum
    )
  );

  // Calculate the eccentricity. (magnitude of the eccentricity vector)
  const eccentricity = _eccentricityVector.length();

  // Calculate the semi-major and semi-minor axes.
  const semiLatusRectum = getSemiLatusRectumFromAngularMomentum(
    _specificAngularMomentum,
    gravParam
  );
  const semiMajorAxis = getSemiMajorAxisFromSemiLatusRectum(
    semiLatusRectum,
    eccentricity
  );
  const semiMinorAxis = getSemiMinorAxisFromSemiLatusRectum(
    semiMajorAxis,
    semiLatusRectum
  );

  // Calculate the inclination.
  const inclination = calculateInclination(_specificAngularMomentum, _zAxis);

  // Calculate the longitude of the ascending node.
  const longitudeOfAscendingNode = calculateLongitudeOfAscendingNode(
    _ascendingNode,
    _xAxis
  );

  // Calculate the argument of periapsis.
  const argumentOfPeriapsis = calculateArgumentOfPeriapsis(
    _ascendingNode,
    _eccentricityVector
  );

  // Calculate the true anomaly.
  const trueAnomaly = calculateTrueAnomaly(
    position,
    velocity,
    _eccentricityVector
  );

  _pos.set(...getPosition(trueAnomaly, semiMajorAxis, eccentricity));
  _vel.set(
    ...getVelocityVector(
      centralMass,
      orbitingMass,
      _specificAngularMomentum.length(),
      trueAnomaly,
      eccentricity
    )
  );

  console.log('position_0:', position.toArray());
  console.log('position_1:', _pos.toArray());
  console.log('velocity_0:', velocity.toArray());
  console.log('velocity_1:', _vel.toArray());

  // Calculate apsides.
  const periapsis = getPeriapsisFromEccentricity(semiMajorAxis, eccentricity);
  const apoapsis = getApoapsisFromEccentricity(semiMajorAxis, eccentricity);

  return {
    position: _pos.toArray(),
    velocity: _vel.toArray(),

    eccentricity,
    semiMajorAxis,
    semiMinorAxis,
    semiLatusRectum,

    periapsis,
    apoapsis,

    inclination,
    longitudeOfAscendingNode,
    argumentOfPeriapsis,

    trueAnomaly,
  };
};
