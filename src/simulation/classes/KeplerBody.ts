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
export const traverseTree = (node: KeplerBody, deltaTime: number) => {
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

/**
 * @summary Function factory that takes in an update function and returns an
 * iterative pre-order n-ary tree traversal function which calls the update
 * function with each node
 *
 * @description
 * @author Ryan Milligan
 * @date 22/06/2023
 * @export
 * @param {(body: KeplerBody, deltaTime: number) => void} updateFn
 * @returns {*}
 */
export function makePreOrderTreeTraversalFn(
  updateFn: (body: KeplerBody, deltaTime: number) => void
) {
  return (root: KeplerBody, deltaTime: number) => {
    console.assert(root, 'null root');

    // stack to hold the visited nodes
    const stack: KeplerBody[] = [];

    // call the updateFn on the root node
    // if there are no orbiting bodies, return
    if (root.orbitingBodies.length === 0) {
      updateFn(root, deltaTime);
      return;
    }

    // push the root into the stack
    stack.push(root);

    while (stack.length !== 0) {
      const node: KeplerBody = stack.pop()!;
      updateFn(node, deltaTime);
      // iterate backwards through child nodes and push each of
      // them onto the stack from right to left
      for (let i = node.orbitingBodies.length - 1; i >= 0; i--) {
        stack.push(node.orbitingBodies[i]!);
      }
      // the last one pushed onto the stack will be popped on the next
      // iteration of the loop
    }
  };
}

export default KeplerBody;
