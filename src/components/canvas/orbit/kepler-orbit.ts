import { type MutableRefObject } from 'react';
import { Object3D } from 'three';
import KeplerBody from '../body/kepler-body';

type OrbitalElements = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  semiLatusRectum: number;
  linearEccentricity: number;
  eccentricity: number;
  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
  orbitalPeriod: number;
};

/**
 * @description Represents an idealized 2-body orbital system that neglects perturbing forces besides the gravitational attraction of the central body.
 * @author Ryan Milligan
 * @date Sep/07/2023
 * @export
 * @class KeplerOrbit
 * @extends {Object3D}
 */
export class KeplerOrbit extends Object3D {
  private _centralBodyRef: MutableRefObject<KeplerBody | null> = null!;
  private _orbitingBodyRef: MutableRefObject<KeplerBody | null> = null!;

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

  /**
   * Creates an instance of KeplerOrbit.
   * @author Ryan Milligan
   * @date Sep/07/2023
   * @memberof KeplerOrbit
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

  get orbitingBodyRef() {
    return this._orbitingBodyRef;
  }

  set orbitingBodyRef(ref: MutableRefObject<KeplerBody | null>) {
    if (this._orbitingBodyRef) {
      if (this._orbitingBodyRef === ref) {
        return;
      }
      console.log('orbiting body ref is already assigned');
      return;
    }
    this._orbitingBodyRef = ref;
  }

  get centralBodyRef() {
    return this._centralBodyRef;
  }

  set centralBodyRef(ref: MutableRefObject<KeplerBody | null>) {
    if (this._centralBodyRef) {
      if (this._centralBodyRef === ref) {
        return;
      }
      console.log('central body ref is already assigned');
      return;
    }
    this._centralBodyRef = ref;
  }

  get orbitalPeriod() {
    return this._orbitalPeriod;
  }
  set orbitalPeriod(orbitalPeriod: number) {
    this._orbitalPeriod = orbitalPeriod;
  }
}
