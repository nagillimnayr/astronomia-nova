import { proxy } from 'valtio';
import KeplerBody, { traverseTree } from '../classes/KeplerBody';
import { DAY } from '../utils/constants';
import { makeFixedUpdateFn } from '../systems/FixedTimeStep';

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
