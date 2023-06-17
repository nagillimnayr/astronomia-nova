import { square } from 'mathjs';
import { GRAV_CONST } from '~/simulation/utils/constants';

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 *
 * @param {number} orbitalSpeed (meters/sec)
 * @param {number} centralMass (kg)
 * @param {number} periapsis (meters)
 *
 * @returns {number} {number} specificOrbitalEnergy
 */
const calculate = (
  orbitalSpeed: number,
  centralMass: number,
  periapsis: number
) => {
  const specificOrbitalEnergy =
    square(orbitalSpeed) / 2.0 - (GRAV_CONST * centralMass) / periapsis;
  return specificOrbitalEnergy;
};

export const SpecificOrbitalEnergy = {
  calculate,
};
