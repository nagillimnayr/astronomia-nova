import { Vector3 } from 'three';
import type KeplerBody from '../classes/KeplerBody';
import calculateGravitation from '../math/motion/gravitation';

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
 * @returns {(root: KeplerBody, deltaTime: number) => void}
 */
export function makePreOrderTreeTraversalFn(
  updateFn: (body: KeplerBody, deltaTime: number) => void
): (root: KeplerBody, deltaTime: number) => void {
  return (root: KeplerBody, deltaTime: number) => {
    console.assert(root, 'null root');

    // stack to hold the nodes that still need to be visited
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

// The central body will always be at the zero vector of the local coordinate space of the orbiting body, so we can simply use a zero vector.
const _centralPos = new Vector3();
export const traverseKeplerTree = makePreOrderTreeTraversalFn(
  (body: KeplerBody, deltaTime: number) => {
    for (const orbitingBody of body.orbitingBodies) {
      orbitingBody.acceleration = calculateGravitation(
        orbitingBody.position,
        _centralPos,
        body.mass
      );
      orbitingBody.update(deltaTime);
    }
  }
);
