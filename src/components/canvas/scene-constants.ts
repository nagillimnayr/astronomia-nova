import {
  DIST_MULT,
  METER,
  SOLAR_SYSTEM_RADIUS,
} from '@/simulation/utils/constants';

export const NEAR_CLIP = 1e-5;
export const FAR_CLIP = (2 * SOLAR_SYSTEM_RADIUS) / DIST_MULT;
console.log('Far plane:', FAR_CLIP);
console.log(`1e13 `, 1e13);

export const SURFACE_NEAR_CLIP = METER / 10;
