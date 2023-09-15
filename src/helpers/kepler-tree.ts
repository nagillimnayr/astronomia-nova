import { velocityVerletIntegration } from '@/helpers/physics/integration/integration-methods';
import { Vector3 } from 'three';
import { type KeplerBody } from '@/components/canvas/body/kepler-body';

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

    // Stack to hold the nodes that still need to be visited.
    const stack: KeplerBody[] = [];

    // Call the updateFn on the root node.
    // If there are no orbiting bodies, return.
    if (root.orbitingBodies.length === 0) {
      updateFn(root, deltaTime);
      return;
    }

    // Push the root into the stack.
    stack.push(root);

    while (stack.length !== 0) {
      const node: KeplerBody = stack.pop()!;
      updateFn(node, deltaTime);
      // Iterate backwards through child nodes and push each of them onto the stack from right to left.
      for (let i = node.orbitingBodies.length - 1; i >= 0; i--) {
        stack.push(node.orbitingBodies[i]!);
      }
      // The last one pushed onto the stack will be popped on the next iteration of the loop.
    }
  };
}

// The central body will always be at the zero vector of the local coordinate
// space of the orbiting body, so we can simply use a zero vector.

// This function will traverse the tree and for each node, it will iterate over
// their orbiting bodies and update them.
export const traverseKeplerTree = makePreOrderTreeTraversalFn(
  (body: KeplerBody, deltaTime: number) => {
    // Iterate through orbiting bodies and update each of them.
    for (const orbitingBody of body.orbitingBodies) {
      velocityVerletIntegration(orbitingBody, body.mass, deltaTime);
      orbitingBody.dispatchEvent({ type: 'updated' });
    }
  }
);
