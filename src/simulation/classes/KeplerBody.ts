import { Vector3Tuple } from 'three';

import { DynamicBody } from './Dynamics';
import calculateGravitation from '../systems/physics/forces/calculateGravitation';

class KeplerBody extends DynamicBody {
  private _orbitingBodies: KeplerBody[];
  constructor(
    mass?: number,
    initialPosition?: Vector3Tuple,
    initialVelocity?: Vector3Tuple
  ) {
    super(mass, initialPosition, initialVelocity);
    this._orbitingBodies = [];
  }

  get orbitingBodies() {
    return this._orbitingBodies;
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
