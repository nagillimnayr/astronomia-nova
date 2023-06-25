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
  meanLongitude_deg: number;
  longitudeOfPeriapsis_deg: number;
  longitudeOfAscendingNode_deg: number;
  axialTilt_deg: number;
  siderealRotationPeriod_hrs: number;
  siderealRotationPeriod_days: number;
  color: string;
}
interface PlanetDataJSON {
  Mercury: PlanetData;
  Venus: PlanetData;
  Earth: PlanetData;
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

  const color = new Color(parseInt(planetData.Color, 16));

  // extract data from JSON
  const mass = planetData.Mass_KG;
  const initialPosition: number = planetData.Periapsis_M / DIST_MULT;
  const initialVelocity: number =
    (planetData.MaxVelocity_KMs * KM_TO_M) / DIST_MULT;
  const meanRadius = planetData.MeanRadius_M / EARTH_RADIUS / 2; // scale to be relative to Earth's radius

  const eccentricity = planetData.Eccentricity;

  // angular parameters
  const inclination = planetData.Inclination_Deg;
  const longitudeOfPeriapsis = planetData.LongitudeOfPeriapsis_Deg;
  const longitudeOfAscendingNode = planetData.LongitudeOfAscendingNode_Deg;
  const argumentOfPeriapsis = longitudeOfPeriapsis - longitudeOfAscendingNode;
  const axialTilt = planetData.AxialTilt_Deg;

  const meanLongitude = planetData.MeanLongitude_Deg;

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
    longitudeOfPeriapsis,
    argumentOfPeriapsis,
    axialTilt,
    meanLongitude,
  };
}
