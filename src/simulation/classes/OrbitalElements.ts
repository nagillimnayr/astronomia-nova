import { Vector3Tuple } from 'three';
import { calculateOrbitFromPeriapsis } from '../math/orbit/calculateOrbit';

type OrbitElements = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  semiLatusRectum: number;
  eccentricity: number;
  linearEccentricity: number;

  specificOrbitalEnergy: number;
  specificAngularMomentum: number;
  orbitalPeriod: number;
  orbitalSpeed: number;

  // angular elements
  inclination: number;
  longitudeOfPeriapsis: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  axialTilt: number; // Angle in degrees between the direction of the Orbiting Body's positive pole and the normal of the orbital plane, A.K.A Obliquity

  // anomalies
  trueAnomaly: number;
  eccentricAnomaly: number;
  meanAnomaly: number;
  meanAngularMotion: number;
};

type InitialParameters = {
  periapsis: number;
  maxOrbitalSpeed: number;
  centralMass: number;
};

type StateVectors = {
  position?: Vector3Tuple;
  velocity?: Vector3Tuple;
};

export class OrbitalElements {
  private _semiMajorAxis: number;
  private _semiMinorAxis: number;
  private _semiLatusRectum: number;
  private _eccentricity: number;
  private _linearEccentricity: number;

  private _specificOrbitalEnergy: number;
  // private _specificAngularMomentum!: number;
  // private _orbitalPeriod!: number;
  // private _orbitalSpeed!: number;

  // angular elements
  // private _inclination!: number;
  // private _longitudeOfPeriapsis!: number;
  // private _longitudeOfAscendingNode!: number;
  // private _argumentOfPeriapsis!: number;
  // private _axialTilt!: number; // Angle in degrees between the direction of the Orbiting Body's positive pole and the normal of the orbital plane, A.K.A Obliquity

  // anomalies
  //private _trueAnomaly!: number;
  //private _eccentricAnomaly!: number;
  //private _meanAnomaly!: number;
  //private _meanAngularMotion!: number;

  // apsides
  private _apoapsis: number;
  private _periapsis: number;

  constructor(parameters: InitialParameters) {
    // calculate orbital elements from initial parameters
    const { periapsis, maxOrbitalSpeed, centralMass } = parameters;
    const elements = calculateOrbitFromPeriapsis(
      periapsis,
      maxOrbitalSpeed,
      centralMass
    );
    this._semiMajorAxis = elements.semiMajorAxis;
    this._semiMinorAxis = elements.semiMinorAxis;
    this._semiLatusRectum = elements.semiLatusRectum;

    this._apoapsis = elements.apoapsis;
    this._periapsis = elements.periapsis;

    this._linearEccentricity = elements.linearEccentricity;
    this._eccentricity = elements.eccentricity;
    this._specificOrbitalEnergy = elements.specificOrbitalEnergy;
  }

  get semiMajorAxis() {
    return this._semiMajorAxis;
  }
  get semiMinorAxis() {
    return this._semiMinorAxis;
  }
}
