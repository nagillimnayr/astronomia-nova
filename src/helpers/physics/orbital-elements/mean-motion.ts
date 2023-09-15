import { TWO_PI } from '@/constants';

export function computeMeanMotion(orbitalPeriod: number) {
  return TWO_PI / orbitalPeriod;
}
