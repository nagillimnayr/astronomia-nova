import { type Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';

/**
 * @description
 * $$ \displaystyle i = \arccos{\left( \frac{ \vec{K} \cdot \vec{h} }{h} \right)} $$
 *
 * @author Ryan Milligan
 * @date 25/07/2023
 * @export
 * @param {Vector3} specificAngularMomentum
 * @param {Vector3} zAxis
 * @returns {*}
 */
export function calculateInclination(
  specificAngularMomentum: Vector3,
  zAxis: Vector3
) {
  const angularMomentumMagnitude = specificAngularMomentum.length();
  const inclination = radToDeg(
    Math.acos(zAxis.dot(specificAngularMomentum) / angularMomentumMagnitude)
  );
  return inclination;
}
