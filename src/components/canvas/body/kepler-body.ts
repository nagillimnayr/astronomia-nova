import { DynamicBody } from '@/classes/dynamics';
import { DIST_MULT, EARTH_RADIUS } from '@/constants';
import { type MutableRefObject } from 'react';
import { type Mesh, type Vector3Tuple } from 'three';

type Params = {
  mass: number;
  initialPosition?: Vector3Tuple;
  initialVelocity?: Vector3Tuple;
  meanRadius?: number;
  obliquity?: number;
  siderealRotationRate?: number;
  siderealRotationPeriod?: number;
};

class KeplerBody extends DynamicBody {
  private _orbitingBodies: KeplerBody[];
  private _meanRadius: number;
  private _obliquity: number;
  private _siderealRotationRate: number;
  private _siderealRotationPeriod: number;

  private _meshRef: MutableRefObject<Mesh | null> = null!;

  constructor({
    mass = 0,
    initialPosition = [0, 0, 0],
    initialVelocity = [0, 0, 0],
    meanRadius = EARTH_RADIUS,
    obliquity = 0,
    siderealRotationRate = 0,
    siderealRotationPeriod = 0,
  }: Params) {
    super(mass, initialPosition, initialVelocity);

    this.position.divideScalar(DIST_MULT);
    this.velocity.divideScalar(DIST_MULT);

    this._orbitingBodies = [];

    this._meanRadius = meanRadius;
    this._obliquity = obliquity;
    this._siderealRotationRate = siderealRotationRate;
    this._siderealRotationPeriod = siderealRotationPeriod;
  }

  get orbitingBodies() {
    return this._orbitingBodies;
  }

  get meanRadius() {
    return this._meanRadius;
  }

  get obliquity() {
    return this._obliquity;
  }

  get siderealRotationRate() {
    return this._siderealRotationRate;
  }

  get siderealRotationPeriod() {
    return this._siderealRotationPeriod;
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
      console.log('meshRef is already assigned');
      return;
    }
    this._meshRef = meshRef;
  }

  addOrbitingBody(body: KeplerBody) {
    if (!this._orbitingBodies.includes(body)) {
      console.log(`adding ${body.name} as orbiter of ${this.name}`);
      this._orbitingBodies.push(body);
    } else {
      console.log(`${body.name} is already an orbiter of ${this.name}`);
    }
  }

  removeOrbitingBody(body: KeplerBody) {
    console.log(`removing ${body.name} as orbiter of ${this.name}`);
    this._orbitingBodies = this._orbitingBodies.filter((item) => {
      return !Object.is(item, body);
    });
  }

  // Recursively count the number of sub-nodes.
  countSubNodes() {
    let count = this._orbitingBodies.length;
    for (const body of this._orbitingBodies) {
      count += body.countSubNodes();
    }
    return count;
  }
}

export default KeplerBody;
