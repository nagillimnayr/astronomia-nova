import { DynamicBody } from '@/components/canvas/body/dynamic-body';
import { EARTH_RADIUS, DEV_ENV } from '@/constants';
import { type MutableRefObject } from 'react';
import { type Mesh, type Vector3Tuple } from 'three';

/**
 * @description Class representing astronomical bodies, such as stars, planets, dwarf planets.
 * @extends {DynamicBody}
 */
export class KeplerBody extends DynamicBody {
  /** Array of bodies that orbit this body. */
  private _orbitingBodies: KeplerBody[] = [];
  /** The mean volumetric radius of the body in meters. */
  private _meanRadius: number = EARTH_RADIUS;
  /** The obliquity to the body's orbital plane, otherwise known as axial tilt. The angle in degrees between the body's rotational axis and the line perpendicular to its orbital plane. */
  private _obliquity: number = 0;
  /** The rate in radians per second that the body rotates around its rotational axis. */
  private _siderealRotationRate: number = 0;
  /** The time in seconds that it takes the body to make one full rotation about its rotational axis. */
  private _siderealRotationPeriod: number = 0;
  /** Reference to the mesh of the object. */
  private _meshRef: MutableRefObject<Mesh | null> = null!;

  /**
   * Creates an instance of KeplerBody.
   *
   * @param {number} mass
   * @param {Vector3Tuple} initialPosition
   * @param {Vector3Tuple} initialVelocity
   */
  constructor(
    mass: number = 0,
    initialPosition: Vector3Tuple = [0, 0, 0],
    initialVelocity: Vector3Tuple = [0, 0, 0]
  ) {
    super(mass, initialPosition, initialVelocity);
  }

  get orbitingBodies() {
    return this._orbitingBodies;
  }

  get meanRadius() {
    return this._meanRadius;
  }
  set meanRadius(meanRadius: number) {
    this._meanRadius = meanRadius;
  }

  get obliquity() {
    return this._obliquity;
  }
  set obliquity(obliquity: number) {
    this._obliquity = obliquity;
  }

  get siderealRotationRate() {
    return this._siderealRotationRate;
  }
  set siderealRotationRate(siderealRotationRate: number) {
    this._siderealRotationRate = siderealRotationRate;
  }

  get siderealRotationPeriod() {
    return this._siderealRotationPeriod;
  }
  set siderealRotationPeriod(siderealRotationPeriod: number) {
    this._siderealRotationPeriod = siderealRotationPeriod;
  }

  get meshRef(): MutableRefObject<Mesh | null> {
    return this._meshRef;
  }
  set meshRef(meshRef: MutableRefObject<Mesh | null>) {
    this.setMeshRef(meshRef);
  }

  setMeshRef(meshRef: MutableRefObject<Mesh | null>) {
    // If mesh has already been assigned, do nothing.
    if (this._meshRef) {
      if (this._meshRef === meshRef) return;
      DEV_ENV && console.log('meshRef is already assigned');
      return;
    }
    this._meshRef = meshRef;
  }

  addOrbitingBody(body: KeplerBody) {
    if (!this._orbitingBodies.includes(body)) {
      DEV_ENV && console.log(`Adding ${body.name} as orbiter of ${this.name}.`);
      this._orbitingBodies.push(body);
    } else {
      DEV_ENV &&
        console.warn(`${body.name} is already an orbiter of ${this.name}.`);
    }
  }

  removeOrbitingBody(body: KeplerBody) {
    DEV_ENV && console.log(`removing ${body.name} as orbiter of ${this.name}`);
    this._orbitingBodies = this._orbitingBodies.filter((item) => {
      return !Object.is(item, body);
    });
  }

  /**  Recursively count the number of sub-nodes. (The number of bodies which orbit this body, and all of their orbiting bodies... etc.) */
  countSubNodes() {
    let count = this._orbitingBodies.length;
    for (const body of this._orbitingBodies) {
      count += body.countSubNodes();
    }
    return count;
  }
}
