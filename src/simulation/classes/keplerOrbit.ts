import type KeplerBody from './KeplerBody';
import { MutableRefObject } from 'react';

type OrbitalElements = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  semiLatusRectum: number;
  linearEccentricity: number;
  eccentricity: number;

  inclination: number;
  longitudeOfAscendingNode: number;
  argumentOfPeriapsis: number;
};
export class KeplerOrbit {
  private _centralBodyRef: MutableRefObject<KeplerBody | null> = null!;
  private _orbitingBodyRef: MutableRefObject<KeplerBody | null> = null!;

  private _semiMajorAxis: number;
  private _semiMinorAxis: number;
  private _semiLatusRectum: number;
  private _linearEccentricity: number;
  private _eccentricity: number;

  private _inclination: number;
  private _longitudeOfAscendingNode: number;
  private _argumentOfPeriapsis: number;

  constructor(elements: OrbitalElements) {
    this._semiMajorAxis = elements.semiMajorAxis;
    this._semiMinorAxis = elements.semiMinorAxis;
    this._semiLatusRectum = elements.semiLatusRectum;
    this._linearEccentricity = elements.linearEccentricity;
    this._eccentricity = elements.eccentricity;

    this._inclination = elements.inclination;
    this._longitudeOfAscendingNode = elements.longitudeOfAscendingNode;
    this._argumentOfPeriapsis = elements.argumentOfPeriapsis;
  }

  get semiMajorAxis() {
    return this._semiMajorAxis;
  }

  get semiMinorAxis() {
    return this._semiMinorAxis;
  }

  get semiLatusRectum() {
    return this._semiLatusRectum;
  }

  get linearEccentricity() {
    return this._linearEccentricity;
  }

  get eccentricity() {
    return this._eccentricity;
  }

  get inclination() {
    return this._inclination;
  }

  get longitudeOfAscendingNode() {
    return this._longitudeOfAscendingNode;
  }

  get argumentOfPeriapsis() {
    return this._argumentOfPeriapsis;
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
}