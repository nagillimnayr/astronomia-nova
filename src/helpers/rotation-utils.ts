import {TWO_PI} from '../constants/constants';

/**
 * @description Adjust the angle to be within the range [0, 2PI).
 *
 * @author Ryan Milligan
 * @date 16/08/2023
 * @export
 * @param {number} angle
 * @returns {*}
 */
export function normalizeAngle(angle: number) {
  let adjustedAngle = angle % TWO_PI;
  while (adjustedAngle < 0) {
    adjustedAngle += TWO_PI;
  }

  return adjustedAngle;
}
