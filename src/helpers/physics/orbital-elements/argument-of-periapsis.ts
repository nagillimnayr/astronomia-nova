import { type Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';

/**
 * @description
 * $$ \displaystyle \omega = \arccos{\left(\frac{\vec{n}\cdot\vec{e}}{ne}
 *   \right)} $$
 *
 * @param {Vector3} ascendingNode
 * @param {Vector3} eccentricityVector
 * @returns {number}
 */
export function calculateArgumentOfPeriapsis(
  ascendingNode: Vector3,
  eccentricityVector: Vector3
): number {
  const argumentOfPeriapsis = radToDeg(
    ascendingNode.dot(eccentricityVector) /
      (ascendingNode.length() * eccentricityVector.length())
  );

  if (eccentricityVector.z < 0) {
    return 360 - argumentOfPeriapsis;
  }
  return argumentOfPeriapsis;
}
