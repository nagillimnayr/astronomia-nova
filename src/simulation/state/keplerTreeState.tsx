import { proxy } from 'valtio';
import KeplerBody from '../classes/KeplerBody';

const setRoot = (root: KeplerBody) => {
  if (keplerTreeState.root) {
    console.log('root already exists: ', keplerTreeState.root);
  }

  console.log(`setting ${root.name} as root`);
  keplerTreeState.root = root;
};

type KeplerTreeStateObj = {
  root: KeplerBody;
  setRoot: (root: KeplerBody) => void;
};

export const keplerTreeState = proxy<KeplerTreeStateObj>({
  root: null!,
  setRoot,
});
