import { degToRad } from 'three/src/math/MathUtils';

export const GRAV_CONST = 6.674e-11; // Gravitational Constant m^3/kg/s^2;
export const AU = 1.495978707e11; // Astronomical Unit in m
// export const SOLAR_MASS = 1.989e30; // Solar Mass in kg
export const SOLAR_MASS = 1988500e24; // Solar Mass in kg
export const DAY = 86400; // Day in seconds
export const YEAR = 360.25; // Year in Days
// export const DIST_MULT = 1e10; // Distance multiplier (10 unit = 1x10^11m = 100,000,000km)
// export const DIST_MULT = 1e9; // Distance multiplier (100 unit = 1x10^11m = 100,000,000km)
export const DIST_MULT = 1e8; // Distance multiplier
export const KM_TO_M = 1000; // User enters value in km and this converts it to m
export const MASS_MULT = 1e24;
export const EARTH_RADIUS = 6371.0084e3;
export const SUN_RADIUS = 696340e3;

export const METER: Readonly<number> = 1 / DIST_MULT;

export const PI_SQUARED: Readonly<number> = Math.pow(Math.PI, 2);

export const UPDATES_PER_DAY: Readonly<number> = 60;

// Angles in radians

export const TWO_PI: Readonly<number> = Math.PI * 2;
export const PI: Readonly<number> = Math.PI;
export const PI_OVER_TWO: Readonly<number> = Math.PI / 2;
export const PI_OVER_FOUR: Readonly<number> = Math.PI / 4;
export const RADS_90: Readonly<number> = degToRad(90); // 90 degrees in radians.
export const RADS_180: Readonly<number> = degToRad(180); // 180 degrees in radians.
