import { Vector3, type Mesh, type Vector3Tuple } from 'three';

import { DynamicBody } from './Dynamics';
import { DIST_MULT, EARTH_RADIUS } from '../utils/constants';
import { degToRad } from 'three/src/math/MathUtils';
import { type MutableRefObject } from 'react';

class KeplerBody extends DynamicBody {
  private _orbitingBodies: KeplerBody[];
  private _meanRadius: number;
  private _obliquity: number;

  private _meshRef: MutableRefObject<Mesh | null> = null!;

  constructor(
    mass: number,
    initialPosition?: Vector3Tuple,
    initialVelocity?: Vector3Tuple,
    meanRadius?: number,
    obliquity?: number
  ) {
    super(mass, initialPosition, initialVelocity);

    this.position.divideScalar(DIST_MULT);
    this.velocity.divideScalar(DIST_MULT);

    this._orbitingBodies = [];

    this._meanRadius = meanRadius ?? EARTH_RADIUS;
    this._obliquity = obliquity ?? 0;
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

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// export const traverseTree = (node: KeplerBody, deltaTime: number) => {
//   console.assert(node, 'null node');

//   for (const orbitingBody of node.orbitingBodies) {
//     // convert the vector returned into an array and spread it so that we can use the .set()
//     // method so as to avoid unnecessary garbage collection
//     orbitingBody.acceleration.set(
//       ...calculateGravitation(orbitingBody, node).toArray()
//     );

//     // update velocity and position
//     orbitingBody.update(deltaTime);

//     // traverse deeper into the tree
//     if (orbitingBody.orbitingBodies.length > 0) {
//       traverseTree(orbitingBody, deltaTime);
//     }
//   }
// };

export default KeplerBody;
