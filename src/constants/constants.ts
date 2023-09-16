import { Vector3 } from 'three';

export const ORIGIN: Readonly<Vector3> = new Vector3(0, 0, 0);
export const ZERO_VECTOR: Readonly<Vector3> = ORIGIN; // Alias for ORIGIN.
export const X_AXIS: Readonly<Vector3> = new Vector3(1, 0, 0);
export const Y_AXIS: Readonly<Vector3> = new Vector3(0, 1, 0);
export const Z_AXIS: Readonly<Vector3> = new Vector3(0, 0, 1);
export const X_AXIS_NEG: Readonly<Vector3> = new Vector3(-1, 0, 0);
export const Y_AXIS_NEG: Readonly<Vector3> = new Vector3(0, -1, 0);
export const Z_AXIS_NEG: Readonly<Vector3> = new Vector3(0, 0, -1);

export const DAY = 86400; // Synodic Day in seconds.
export const HOUR = 3600; // Hour in seconds.
export const YEAR = 360.25; // Year in Days.
export const TIME_MULT = HOUR;
// J2000 epoch (January 1st, 2000, 12:00:00pm TT)
export const J2000: Readonly<Date> = new Date(
  'January 01, 2000 12:00:00 GMT-0'
);
export const J2000_JD = 2451545.0; // J2000 in Julian Days.

// export const DIST_MULT = 1e10; // Distance multiplier (10 units = 1x10^11m =
// 100,000,000km) export const DIST_MULT = 1e9; // Distance multiplier (100
// units = 1x10^11m = 100,000,000km) export const DIST_MULT = 1e8; // Distance
// multiplier.
export const DIST_MULT = 1; // Distance multiplier.
export const KM_TO_M = 1000;
export const METER = 1 / DIST_MULT;

export const GRAV_CONST = 6.674e-11; // Gravitational Constant m^3/kg/s^2;
export const AU = 1.495978707e11; // Astronomical Unit in m
export const SOLAR_MASS = 1988500e24; // Solar Mass in kg
export const SOLAR_SYSTEM_RADIUS = AU * 90;
export const SIMULATION_RADIUS = 4 * SOLAR_SYSTEM_RADIUS * METER;

export const MASS_MULT = 1e24;

export const EARTH_RADIUS = 6371.0084e3;
export const SUN_RADIUS = 696340e3;

export const PI_SQUARED = Math.pow(Math.PI, 2);

export const UPDATES_PER_REAL_SECOND = 60;

// Angles in radians
export const PI = Math.PI;
export const DEG_TO_RADS = PI / 180;
export const RADS_TO_DEG = 180 / PI;
export const TWO_PI = Math.PI * 2;
export const PI_OVER_TWO = Math.PI / 2;
export const PI_OVER_THREE = Math.PI / 4;
export const PI_OVER_FOUR = Math.PI / 4;
export const PI_OVER_SIX = Math.PI / 4;

// Coords (in Degrees)
export const MIN_LATITUDE = -90;
export const MAX_LATITUDE = 90;
export const MIN_LONGITUDE = -180;
export const MAX_LONGITUDE = 180;
