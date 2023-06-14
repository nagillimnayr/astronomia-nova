import { nthRoot, square } from 'mathjs';
import {
  DIST_MULT,
  GRAV_CONST,
  PI_SQUARED,
  SOLAR_MASS,
} from '~/simulation/utils/constants';

export const SemiMajorAxis = {
  getFromPeriapsis: getFromPeriapsis,

  getFromApoapsis: getFromApoapsis,
};

/**
 * @description
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} eccentricity
 * @param {number} periapsis
 * @returns {number} {number} semiMajorAxis
 */
function getFromPeriapsis(eccentricity: number, periapsis: number): number {
  const semiMajorAxis = periapsis / (1 - eccentricity);

  return semiMajorAxis;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} eccentricity
 * @param {number} apoapsis
 * @returns {number} {number} semiMajorAxis
 */
function getFromApoapsis(eccentricity: number, apoapsis: number): number {
  const semiMajorAxis = apoapsis / (1 + eccentricity);

  return semiMajorAxis;
}

function getFromLinearEccentricity(
  eccentricity: number,
  linearEccentricity: number
) {
  return linearEccentricity / eccentricity;
}

function getFromSpecificOrbitalEnergy(
  centralMass: number,
  specificOrbitalEnergy: number
) {
  const semiMajorAxis =
    -(GRAV_CONST * (centralMass / (2.0 * specificOrbitalEnergy))) / DIST_MULT; // scale distance
  return semiMajorAxis;
}

/**
 * @summary Calculate the semi-major axis from the orbital period and the mass of the central body.
 *
 * @description
 * \displaystyle a = \sqrt[3]{\frac{GM T^2}{4\pi^2}}
 *
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} period
 * @param {number} centralMass
 * @returns {*}  {number} semiMajorAxis
 */
function getFromPeriod(period: number, centralMass: number): number {
  // cube root of (G*M * T^2) / (4PI^2)
  const semiMajorAxis = nthRoot(
    (GRAV_CONST * centralMass * square(period)) / (4.0 * PI_SQUARED),
    3
  ) as number;
  return semiMajorAxis;
}

/**
 * @description
 * @author Ryan Milligan
 * @date 14/06/2023
 * @param {number} apoapsis
 * @param {number} periapsis
 * @returns {*}
 */
function getFromApsides(apoapsis: number, periapsis: number) {
  return (periapsis + apoapsis) / 2.0;
}
