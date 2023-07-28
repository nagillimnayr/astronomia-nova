import { Mesh, Vector3Tuple } from 'three';

import { DynamicBody } from './Dynamics';
import { EARTH_RADIUS } from '../utils/constants';
import { degToRad } from 'three/src/math/MathUtils';

class KeplerBody extends DynamicBody {
  private _orbitingBodies: KeplerBody[];
  private _meanRadius: number;
  private _obliquity: number;

  private _bodyMesh: Mesh | null = null;

  constructor(
    mass?: number,
    initialPosition?: Vector3Tuple,
    initialVelocity?: Vector3Tuple,
    meanRadius?: number,
    obliquity?: number
  ) {
    super(mass, initialPosition, initialVelocity);
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

  get bodyMesh(): Mesh | null {
    return this._bodyMesh;
  }
  set bodyMesh(bodyMesh: Mesh) {
    this.setBodyMesh(bodyMesh);
  }
  setBodyMesh(bodyMesh: Mesh) {
    // If mesh has already been assigned, do nothing.
    if (this._bodyMesh) {
      if (this._bodyMesh === bodyMesh) return;
      console.log('bodyMesh is already assigned');
      return;
    }
    this._bodyMesh = bodyMesh;
    // Rotate by obliquity.
    this._bodyMesh.rotation.set(0, 0, degToRad(this._obliquity));
    console.log('rotating mesh');
  }

  addOrbitingBody(body: KeplerBody) {
    console.log(`adding ${body.name} as orbiter of ${this.name}`);
    if (!this._orbitingBodies.includes(body)) {
      this._orbitingBodies.push(body);
    }
  }

  removeOrbitingBody(body: KeplerBody) {
    console.log(`removing ${body.name} as orbiter of ${this.name}`);
    this._orbitingBodies = this._orbitingBodies.filter((item) => {
      return !Object.is(item, body);
    });
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
