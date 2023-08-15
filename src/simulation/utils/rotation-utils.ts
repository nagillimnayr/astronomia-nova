import { TWO_PI } from './constants';

export function normalizeAngle(angle: number) {
  let adjustedAngle = angle;
  while (adjustedAngle < TWO_PI) {
    adjustedAngle += TWO_PI;
  }
  while (adjustedAngle > TWO_PI) {
    adjustedAngle -= TWO_PI;
  }
  return adjustedAngle;
}
