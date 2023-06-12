import { Vector3 } from 'three';
import { DynamicBody } from './Dynamics';
import calculateGravitation from '../systems/physics/forces/calculateGravitation';
import Vec3 from '../types/Vec3';

class KeplerBody extends DynamicBody {
  private _orbitingBodies: KeplerBody[];
  constructor(mass?: number, initialPosition?: Vec3, initialVelocity?: Vec3) {
    super(mass, initialPosition, initialVelocity);
    this._orbitingBodies = [];
  }

  get orbitingBodies() {
    return this._orbitingBodies;
  }

  addOrbitingBody(body: KeplerBody) {
    if (!this._orbitingBodies.includes(body)) {
      this._orbitingBodies.push(body);
    }
  }

  removeOrbitingBody(body: KeplerBody) {
    this._orbitingBodies = this._orbitingBodies.filter((item) => {
      return !Object.is(item, body);
    });
  }
}

const traverseTree = (node: KeplerBody, deltaTime: number) => {
  console.assert(node, 'null node');

  for (const orbitingBody of node.orbitingBodies) {
    // convert the vector returned into an array and spread it so that we can use the .set()
    // method so as to avoid unnecessary garbage collection
    orbitingBody.acceleration.set(
      ...calculateGravitation(orbitingBody, node).toArray()
    );

    // update velocity and position
    orbitingBody.update(deltaTime);

    // traverse deeper into the tree
    if (orbitingBody.orbitingBodies.length > 0) {
      traverseTree(orbitingBody, deltaTime);
    }
  }
};

export default KeplerBody;
export { traverseTree };
