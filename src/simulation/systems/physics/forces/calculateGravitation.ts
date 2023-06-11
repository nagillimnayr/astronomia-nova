import { Vector3 } from 'three';
import { DIST_MULT, GRAV_CONST, SOLAR_MASS } from '../../../utils/constants';
import PointMass from '../../../types/interfaces/PointMass';

/**
 * @description
 * @author Ryan Milligan
 * @date 28/05/2023
 * @export
 * @param {PointMass} obj1
 * @param {PointMass} obj2
 * @returns {Vector3}
 */
export default function calculateGravitation(
  obj1: PointMass,
  obj2: PointMass
): Vector3 {
  const diffPos = new Vector3().subVectors(obj2.position, obj1.position);

  const distSquared = diffPos.clone().multiplyScalar(DIST_MULT).lengthSq();

  const direction = diffPos.clone().normalize();

  const gravForce = (GRAV_CONST * obj2.mass * SOLAR_MASS) / distSquared;

  const acceleration = direction.clone().multiplyScalar(gravForce);
  return acceleration.multiplyScalar(1 / DIST_MULT);
}
