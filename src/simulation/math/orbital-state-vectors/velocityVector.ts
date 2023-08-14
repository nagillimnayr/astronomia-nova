import { GRAV_CONST } from '../../utils/constants';
import { Vector3, Vector3Tuple } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const _velocity = new Vector3();

/**
 * @summary
 *
 * @description
 * https://orbital-mechanics.space/classical-orbital-elements/orbital-elements-and-the-state-vector.html?highlight=velocity
 * https://orbital-mechanics.space/classical-orbital-elements/perifocal-frame.html?highlight=velocity#velocity-vector
 *
 * @author Ryan Milligan
 * @date 15/07/2023
 * @export
 * @param {number} centralMass
 * @param {number} orbitingMass
 * @param {number} angularMomentumMagnitude
 * @param {number} trueAnomaly
 * @param {number} eccentricity
 * @returns {*}  {Vector3Tuple}
 */
export function getVelocityVector(
  centralMass: number,
  orbitingMass: number,
  angularMomentumMagnitude: number,
  trueAnomaly: number,
  eccentricity: number
): Vector3Tuple {
  const trueAnomalyRadians = degToRad(trueAnomaly);
  const vx = -Math.sin(trueAnomalyRadians);
  const vy = eccentricity + Math.cos(trueAnomalyRadians);

  // const gravitationalParameter = centralMass * orbitingMass * GRAV_CONST;
  const gravitationalParameter = centralMass * GRAV_CONST;

  _velocity
    .set(vx, vy, 0)
    .multiplyScalar(gravitationalParameter / angularMomentumMagnitude);

  return _velocity.toArray();
}
