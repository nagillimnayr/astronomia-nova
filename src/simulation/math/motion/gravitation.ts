import { Vector3 } from 'three';
import {
  DIST_MULT,
  GRAV_CONST,
  SOLAR_MASS,
} from '@/simulation/utils/constants';
import Vec3 from '@/simulation/types/Vec3';

/**
 * @summary
 *
 * @description
 * $$ \displaystyle a = \frac{GM}{r^2} = \frac{F_g}{m} $$
 *
 *
 * @author Ryan Milligan
 * @date 22/06/2023
 * @export
 * @param {Vector3} position
 * @param {Vector3} otherPosition
 * @param {number} otherMass
 * @returns {*}  {Vector3}
 */
export default function calculateGravitation(
  position: Vector3,
  otherPosition: Vector3,
  otherMass: number
): Vec3 {
  const diffPos = new Vector3().subVectors(otherPosition, position);

  const distSquared = diffPos.clone().multiplyScalar(DIST_MULT).lengthSq();

  const direction = diffPos.clone().normalize();

  const gravForce = (GRAV_CONST * otherMass) / distSquared;

  const acceleration = direction.clone().multiplyScalar(gravForce);
  return acceleration.multiplyScalar(1 / DIST_MULT).toArray();
}
