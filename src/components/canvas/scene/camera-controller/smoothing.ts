/**
 * @summary Critically damped smoothing.
 *
 * @description Damped smoothing, mainly for smoothing the camera movement.
 * Adapted from 'Game Programming Gems 4', chapter 1.10 Critically Damped
 *   Ease-In/Ease-Out Smoothing.
 *
 *
 * @author Ryan Milligan
 * @date 23/08/2023
 * @export
 * @param {number} from
 * @param {number} to
 * @param {number} velocity
 * @param {number} smoothTime
 * @param {number} deltaTime
 * @returns {*}  {[number, number]}
 */
export function smoothCritDamp(
  from: number,
  to: number,
  velocity: number,
  smoothTime: number,
  deltaTime: number
): [number, number] {
  const omega = 2 / smoothTime;
  const deltaValue = from - to;

  const omegaDt = omega * deltaTime;
  const omegaDtSq = omegaDt * omegaDt;
  const omegaDtCubed = omegaDtSq * omegaDt;
  const exponentialDecay =
    1 / (1 + omegaDt + 0.48 * omegaDtSq + 0.235 * omegaDtCubed);

  const temp = (velocity + omega * deltaValue) * deltaTime;

  const newValue = to + (deltaValue + temp) * exponentialDecay;
  const newVelocity = (velocity - omega * temp) * exponentialDecay;

  return [newValue, newVelocity];
}
