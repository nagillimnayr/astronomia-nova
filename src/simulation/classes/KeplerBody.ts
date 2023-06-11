import { Vector3 } from 'three';
import { DynamicBody } from './Dynamics';
import calculateGravitation from '../systems/physics/forces/calculateGravitation';

class KeplerBody extends DynamicBody {
  private _orbitingBodies: KeplerBody[];
  constructor(
    mass?: number,
    initialPosition?: Vector3,
    initialVelocity?: Vector3
  ) {
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
    orbitingBody.acceleration = calculateGravitation(orbitingBody, node);
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
