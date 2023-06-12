import data from '../data/presets/Planets.json';
import { Color } from 'three';
import { DIST_MULT, EARTH_RADIUS, KM_TO_M, SOLAR_MASS } from './constants';
import Vec3 from '../types/Vec3';

type key =
  | 'Mercury'
  | 'Venus'
  | 'Earth'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune';

interface PlanetData {
  Mass_KG: number;
  MeanRadius_M: number;
  SemiMajorAxis_M: number;
  SiderealOrbitPeriod_Days: number;
  Periapsis_M: number;
  Apoapsis_M: number;
  MaxVelocity_KMs: number;
  MinVelocity_KMs: number;
  Eccentricity: number;
  Inclination_Deg: number;
  MeanLongitude_Deg: number;
  LongitudeOfPeriapsis_Deg: number;
  LongitudeOfAscendingNode_Deg: number;
  AxialTilt_Deg: number;
  SiderealRotationPeriod_Hrs: number;
  SiderealRotationPeriod_Days: number;
  Color: string;
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
export default function loadBodyPreset(name: key) {
  const jsonData: PlanetDataJSON = data;
  const index: keyof typeof jsonData = name;
  const planetData: PlanetData = jsonData[index];

  const color = new Color(parseInt(planetData.Color, 16));

  const mass = planetData.Mass_KG / SOLAR_MASS;
  const initialPosition: Vec3 = [planetData.Periapsis_M / DIST_MULT, 0, 0];
  const initialVelocity: Vec3 = [
    0,
    0,
    -(planetData.MaxVelocity_KMs * KM_TO_M) / DIST_MULT,
  ];
  const meanRadius = planetData.MeanRadius_M / EARTH_RADIUS / 2;

  return {
    name: name as string,
    color,
    mass,
    initialPosition,
    initialVelocity,
    meanRadius,
  };
}
