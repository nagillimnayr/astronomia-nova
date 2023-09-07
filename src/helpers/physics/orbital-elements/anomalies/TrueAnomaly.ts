import {type Vector3} from 'three';
import {radToDeg} from 'three/src/math/MathUtils';

/**
 * @description
 * $$ \displaystyle \nu = \arccos{\left(\frac{\vec{r}\cdot\vec{e}}{re}  \right)} $$
 *
 * @author Ryan Milligan
 * @date 25/07/2023
 * @export
 * @param {Vector3} position
 * @param {Vector3} velocity
 * @param {Vector3} eccentricityVector
 * @returns {*}
 */
export function calculateTrueAnomaly(
  position: Vector3,
  velocity: Vector3,
  eccentricityVector: Vector3
) {
  const trueAnomaly = radToDeg(
    Math.acos(
      position.dot(eccentricityVector) /
        (position.length() * eccentricityVector.length())
    )
  );

  if (position.dot(velocity) < 0) {
    return 360 - trueAnomaly;
  }
  return trueAnomaly;
}
