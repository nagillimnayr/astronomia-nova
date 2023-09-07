import { GRAV_CONST } from '../../../constants/constants';

/**
 * @description
 * @author Ryan Milligan
 * @date 16/06/2023
 *
 * @param {number} orbitalSpeed (meters/sec)
 * @param {number} centralMass (kg)
 * @param {number} distance (meters)
 *
 * @returns {number} {number} specificOrbitalEnergy
 */
export function getSpecificOrbitalEnergy(
  orbitalSpeed: number,
  centralMass: number,
  distance: number
) {
  const specificOrbitalEnergy =
    orbitalSpeed ** 2 / 2.0 - (GRAV_CONST * centralMass) / distance;
  return specificOrbitalEnergy;
}
