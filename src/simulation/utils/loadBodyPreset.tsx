import data from '../data/presets/Planets.json';
import { Color } from 'three';
import { DIST_MULT, EARTH_RADIUS, KM_TO_M, SOLAR_MASS } from './constants';
import Vec3 from '../types/Vec3';

export type PresetKey =
  | 'Mercury'
  | 'Venus'
  | 'Earth'
  | 'Moon'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune';

interface PlanetData {
  mass_kg: number;
  meanRadius_m: number;
  semiMajorAxis_m: number;
  // SiderealOrbitPeriod_Days: number;
  periapsis_m: number;
  apoapsis_m: number;
  maxVelocity_kms: number;
  minVelocity_kms: number;
  eccentricity: number;
  inclination_deg: number;
  // meanLongitude_deg: number;
  // longitudeOfPeriapsis_deg: number;
  longitudeOfAscendingNode_deg: number;
  argumentOfPeriapsis_deg: number;
  axialTilt_deg: number;
  siderealRotationPeriod_hrs: number;
  siderealRotationPeriod_days: number;

  meanAnomaly_deg_j2000: number;
  trueAnomaly_deg_j2000: number;

  color: string;
}
interface PlanetDataJSON {
  Mercury: PlanetData;
  Venus: PlanetData;
  Earth: PlanetData;
  Moon: PlanetData;
  Mars: PlanetData;
  Jupiter: PlanetData;
  Saturn: PlanetData;
  Uranus: PlanetData;
  Neptune: PlanetData;
}
export default function loadBodyPreset(name: PresetKey) {
  const jsonData: PlanetDataJSON = data;
  const index: keyof typeof jsonData = name;
  const planetData: PlanetData = jsonData[index];

  const color = new Color(parseInt(planetData.color, 16));

  // extract data from JSON
  const mass = planetData.mass_kg;
  const initialPosition: number = planetData.periapsis_m / DIST_MULT;
  const initialVelocity: number =
    (planetData.maxVelocity_kms * KM_TO_M) / DIST_MULT;
  const meanRadius = planetData.meanRadius_m / EARTH_RADIUS / 2; // scale to be relative to Earth's radius

  const eccentricity = planetData.eccentricity;

  // angular parameters
  const inclination = planetData.inclination_deg;
  const argumentOfPeriapsis = planetData.argumentOfPeriapsis_deg;
  const longitudeOfAscendingNode = planetData.longitudeOfAscendingNode_deg;
  const axialTilt = planetData.axialTilt_deg;

  // const meanLongitude = planetData.meanLongitude_deg;

  const meanAnomaly = planetData.meanAnomaly_deg_j2000;
  const trueAnomaly = planetData.trueAnomaly_deg_j2000;

  // return extracted data
  return {
    name: name as string,
    color,
    mass,
    initialPosition,
    initialVelocity,
    meanRadius,
    eccentricity,
    inclination,
    longitudeOfAscendingNode,
    argumentOfPeriapsis,
    axialTilt,
    meanAnomaly,
    trueAnomaly,
  };
}
