import { proxy } from 'valtio';
import KeplerBody, { traverseTree } from '../classes/KeplerBody';
import { DAY } from '../utils/constants';
import { makeFixedUpdateFn } from '../systems/FixedTimeStep';
import { retrogradeState } from '../components/Retrograde/retrogradeState';

type KeplerTreeStateObj = {
  root: KeplerBody;
  setRoot: (root: KeplerBody) => void;
  setUpdateFn: (updateFn: (deltaTime: number) => void) => void;
  fixedUpdate: (deltaTime: number) => void;
};

const setRoot = (root: KeplerBody) => {
  if (keplerTreeState.root) {
    console.log('root already exists: ', keplerTreeState.root);
    console.log('new root: ', root);
  }

  console.log(`setting ${root.name} as root: `, root);
  keplerTreeState.root = root;
  keplerTreeState.fixedUpdate = makeFixedUpdateFn((timeStep: number) => {
    traverseTree(root, timeStep * DAY);
  }, 60);

  if (retrogradeState.path) {
    keplerTreeState.root.add(retrogradeState.path);
    console.log('adding path to tree');
  }
  if (retrogradeState.line) {
    keplerTreeState.root.add(retrogradeState.line);
  }
};

const setUpdateFn = (updateFn: (deltaTime: number) => void) => {
  keplerTreeState.fixedUpdate = updateFn;
};

export const keplerTreeState = proxy<KeplerTreeStateObj>({
  root: null!,
  setRoot,
  setUpdateFn,
  // dummy function that will be overwritten once root is assigned
  fixedUpdate: (deltaTime: number) => {
    console.log('dummy update: ', deltaTime);
    return null;
  },
});

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
