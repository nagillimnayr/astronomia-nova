import {
  DIST_MULT,
  METER,
  SOLAR_SYSTEM_RADIUS,
} from '@/simulation/utils/constants';

export const NEAR_CLIP = 1e-5;
export const FAR_CLIP = (4 * SOLAR_SYSTEM_RADIUS) / DIST_MULT;

export const SURFACE_NEAR_CLIP = METER / 10;
