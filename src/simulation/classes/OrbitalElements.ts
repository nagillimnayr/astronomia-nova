import Vec3 from '../types/Vec3';

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
  eccentricity?: number;
  semiMajorAxis?: number;
  semiMinorAxis?: number;
};

type StateVectors = {
  position?: Vec3;
  velocity?: Vec3;
};

export class OrbitalElements {
  private _semiMajorAxis!: number;
  private _semiMinorAxis!: number;
  private _semiLatusRectum!: number;
  private _eccentricity!: number;
  private _linearEccentricity!: number;

  private _specificOrbitalEnergy!: number;
  private _specificAngularMomentum!: number;
  private _orbitalPeriod!: number;
  private _orbitalSpeed!: number;

  // angular elements
  private _inclination!: number;
  private _longitudeOfPeriapsis!: number;
  private _longitudeOfAscendingNode!: number;
  private _argumentOfPeriapsis!: number;
  private _axialTilt!: number; // Angle in degrees between the direction of the Orbiting Body's positive pole and the normal of the orbital plane, A.K.A Obliquity

  // anomalies
  private _trueAnomaly!: number;
  private _eccentricAnomaly!: number;
  private _meanAnomaly!: number;
  private _meanAngularMotion!: number;

  constructor(parameters: StateVectors) {
    this._semiMajorAxis = elements.semiMajorAxis;
    this._semiMinorAxis = elements.semiMinorAxis;
    this._;
  }
}
