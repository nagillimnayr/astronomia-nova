/** @module True-Anomaly */
import { type Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';

/**
 * $$ \displaystyle \nu = \arccos{\left(\frac{\vec{r}\cdot\vec{e}}{re} \right)} $$
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
 * $$ \displaystyle \beta = \frac{e}{1+\sqrt{1-e^2}} $$
 *
 * $$ \displaystyle \nu = E - 2\arctan{\left( \frac{\beta\sin{E}}{1-\beta\cos{E}} \right)} $$
 *
 * @param {number} eccentricAnomaly in radians.
 * @param {number} eccentricity
 * @returns {number}
 */
export function calculateTrueAnomalyFromEccentricAnomaly(
  eccentricAnomaly: number,
  eccentricity: number
) {
  const beta = eccentricity / (1 + Math.sqrt(1 - eccentricity ** 2));
  const trueAnomaly =
    eccentricAnomaly +
    2 *
      Math.atan(
        (beta * Math.sin(eccentricAnomaly)) /
          (1 - beta * Math.cos(eccentricAnomaly))
      );
  return trueAnomaly;
}
