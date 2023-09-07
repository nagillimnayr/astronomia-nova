import { Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';

const _orbitPlaneNormal = new Vector3();
const _ascendingNode = new Vector3();

export function calculateAscendingNode(
  specificAngularMomentum: Vector3,
  zAxis: Vector3 // Z-Axis of the reference frame.
) {
  _orbitPlaneNormal.copy(specificAngularMomentum).normalize();
  return _ascendingNode.crossVectors(_orbitPlaneNormal, zAxis).toArray();
}

/**
 * @description
 * $$ \displaystyle \Omega = \arccos{\left(\frac{\vec{n}\cdot\vec{X}}{n}
 *   \right)} $$
 *
 * @author Ryan Milligan
 * @date 25/07/2023
 * @export
 * @param {Vector3} ascendingNode
 * @param {Vector3} xAxis
 * @returns {*}
 */
export function calculateLongitudeOfAscendingNode(
  ascendingNode: Vector3,
  xAxis: Vector3 // X-Axis of the reference frame.
) {
  const longitudeOfAscendingNode = radToDeg(
    Math.acos(ascendingNode.dot(xAxis) / ascendingNode.length())
  );

  if (ascendingNode.y < 0) {
    return 360 - longitudeOfAscendingNode;
  }
  return longitudeOfAscendingNode;
}
