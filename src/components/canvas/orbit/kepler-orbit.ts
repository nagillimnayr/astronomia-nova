import { getEccentricAnomalyNewtonsMethod } from '@/helpers/physics/orbital-elements/anomalies/eccentric-anomaly';
import { Object3D } from 'three';
import { type KeplerBody } from '../body';
import {
  getPositionAtEccentricAnomaly,
  getPositionAtTrueAnomaly,
  getPositionFromRadius,
} from '@/helpers/physics/orbital-state-vectors/position';
import { calculateTrueAnomalyFromEccentricAnomaly } from '@/helpers/physics/orbital-elements/anomalies/true-anomaly';
import { getRadiusAtTrueAnomaly } from '@/helpers/physics/orbital-elements/orbital-radius';
import {
  getOrbitalSpeedFromRadius,
  getVelocityDirectionFromOrbitalElements,
} from '@/helpers/physics/orbital-state-vectors/velocity';

/**
 * @description Represents an idealized 2-body orbital system that only considers the gravitational attraction of the central body and neglects perturbing forces.
 * @extends {Object3D}
 */
export class KeplerOrbit extends Object3D {
  /** Half the length of the longest axis of symmetry of the ellipse. */
  private _semiMajorAxis = 0;
  /** Half the length of the shortest axis of symmetry of the ellipse. */
  private _semiMinorAxis = 0;
  private _semiLatusRectum = 0;
  private _linearEccentricity = 0;
  private _eccentricity = 0;

  private _inclination = 0;
  private _longitudeOfAscendingNode = 0;
  private _argumentOfPeriapsis = 0;

  private _orbitalPeriod = 0;
  private _meanMotion = 0;
  /** The initial mean anomaly at the reference epoch. */
  private _initialMeanAnomaly = 0;
  /** Current mean anomaly. */
  private _meanAnomaly = 0;
  private _eccentricAnomaly = 0;
  private _trueAnomaly = 0;

  private _specificAngularMomentum = 0;

  private _orbitingBody: KeplerBody = null!;
  private _centralBody: KeplerBody = null!;

  /**
   * Creates an instance of KeplerOrbit.
   */
  constructor() {
    super();
  }

  get semiMajorAxis() {
    return this._semiMajorAxis;
  }
  set semiMajorAxis(value: number) {
    this._semiMajorAxis = value;
  }

  get semiMinorAxis() {
    return this._semiMinorAxis;
  }
  set semiMinorAxis(value: number) {
    this._semiMinorAxis = value;
  }
  get semiLatusRectum() {
    return this._semiLatusRectum;
  }
  set semiLatusRectum(value: number) {
    this._semiLatusRectum = value;
  }

  get linearEccentricity() {
    return this._linearEccentricity;
  }
  set linearEccentricity(value: number) {
    this._linearEccentricity = value;
  }

  get eccentricity() {
    return this._eccentricity;
  }
  set eccentricity(value: number) {
    this._eccentricity = value;
  }

  get inclination() {
    return this._inclination;
  }
  set inclination(value: number) {
    this._inclination = value;
  }

  get longitudeOfAscendingNode() {
    return this._longitudeOfAscendingNode;
  }
  set longitudeOfAscendingNode(value: number) {
    this._longitudeOfAscendingNode = value;
  }

  get argumentOfPeriapsis() {
    return this._argumentOfPeriapsis;
  }
  set argumentOfPeriapsis(value: number) {
    this._argumentOfPeriapsis = value;
  }

  get orbitalPeriod() {
    return this._orbitalPeriod;
  }
  set orbitalPeriod(orbitalPeriod: number) {
    this._orbitalPeriod = orbitalPeriod;
  }

  get meanMotion() {
    return this._meanMotion;
  }
  set meanMotion(meanMotion: number) {
    this._meanMotion = meanMotion;
  }

  get initialMeanAnomaly() {
    return this._initialMeanAnomaly;
  }
  set initialMeanAnomaly(initialMeanAnomaly: number) {
    this._initialMeanAnomaly = initialMeanAnomaly;
  }

  get orbitingBody() {
    return this._orbitingBody;
  }
  set orbitingBody(body: KeplerBody) {
    this._orbitingBody = body;
  }
  get centralBody() {
    return this._centralBody;
  }
  set centralBody(body: KeplerBody) {
    this._centralBody = body;
  }

  updateOrbitingBody(timeElapsed: number) {
    if (!this._orbitingBody) {
      console.warn('No orbiting body!');
      return;
    }
    // Compute the mean anomaly.
    this._meanAnomaly =
      this._initialMeanAnomaly + this._meanMotion * timeElapsed;
    // Compute the eccentric anomaly.
    this._eccentricAnomaly = getEccentricAnomalyNewtonsMethod(
      this._meanAnomaly,
      this._eccentricity
    );
    // Compute the true anomaly.
    this._trueAnomaly = calculateTrueAnomalyFromEccentricAnomaly(
      this._eccentricAnomaly,
      this._eccentricity
    );
    // getPositionAtEccentricAnomaly(
    //   this._eccentricAnomaly,
    //   this._semiMajorAxis,
    //   this._eccentricity,
    //   this._orbitingBody.position
    // );
    const radius = getRadiusAtTrueAnomaly(
      this._trueAnomaly,
      this._semiMajorAxis,
      this._eccentricity
    );
    getPositionFromRadius(
      radius,
      this._trueAnomaly,
      this._orbitingBody.position
    );

    // Compute the orbital speed.
    const orbitalSpeed = getOrbitalSpeedFromRadius(
      radius,
      this._centralBody.mass,
      this._semiMajorAxis
    );
    getVelocityDirectionFromOrbitalElements(
      this._trueAnomaly,
      this.eccentricity,
      this._orbitingBody.velocity
    );

    this._orbitingBody.velocity.multiplyScalar(orbitalSpeed);
  }
}
