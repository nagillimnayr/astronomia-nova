import { type Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';

/**
 * @description
 * $$ \displaystyle \nu = \arccos{\left(\frac{\vec{r}\cdot\vec{e}}{re}
 *   \right)} $$
 *
 * @param {Vector3} position
 * @param {Vector3} velocity
 * @param {Vector3} eccentricityVector
 * @returns {number} trueAnomaly
 */
export function calculateTrueAnomalyFromStateVectors(
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

/**
 * $$ \displaystyle \nu = \arccos{\left( \frac{\cos{E}-e}{1-e\cos{E}} \right)} $$
 *
 * @param {number} eccentricAnomaly in radians.
 * @param {number} eccentricity
 * @returns {number}
 */
export function calculateTrueAnomalyFromEccentricAnomaly(
  eccentricAnomaly: number,
  eccentricity: number
) {
  const cosE = Math.cos(eccentricAnomaly);
  const trueAnomaly = Math.acos(
    (cosE - eccentricity) / (1 - eccentricity * cosE)
  );
  return trueAnomaly;
}
