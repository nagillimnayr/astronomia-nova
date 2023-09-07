import { METER, SIMULATION_RADIUS } from '@/constants/constants';

export const NEAR_CLIP = 1e-2 * METER;
export const FAR_CLIP = 2 * SIMULATION_RADIUS + 1000;

// export const SURFACE_NEAR_CLIP = METER / 10;
export const SURFACE_NEAR_CLIP = NEAR_CLIP;
