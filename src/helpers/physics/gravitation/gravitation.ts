import { DIST_MULT, GRAV_CONST } from '@/constants/constants';
import { Vector3, type Vector3Tuple } from 'three';

/**
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
 * @returns {Vector3}  {Vector3}
 */
export default function calculateGravitation(
  position: Vector3,
  otherPosition: Vector3,
  otherMass: number
): Vector3Tuple {
  const diffPos = new Vector3().subVectors(otherPosition, position);

  const distSquared = diffPos.clone().multiplyScalar(DIST_MULT).lengthSq();

  const direction = diffPos.clone().normalize();

  const gravForce = (GRAV_CONST * otherMass) / distSquared;

  const acceleration = direction.clone().multiplyScalar(gravForce);
  return acceleration.multiplyScalar(1 / DIST_MULT).toArray();
}
