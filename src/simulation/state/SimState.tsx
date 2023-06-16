import { Object3D } from 'three';
import { proxy } from 'valtio';
import KeplerBody from '../classes/KeplerBody';
import { OrbitControls } from 'three-stdlib';
import { RootState } from '@react-three/fiber';

type SimStateObj = {
  root: KeplerBody;
  selected: KeplerBody | null;
  controls: OrbitControls;

  getState: () => RootState;
  update: (deltaTime: number) => void;
};

export const select = (newSelection: KeplerBody) => {
  if (!newSelection) {
    unselect();
    return;
  }

  simState.selected = newSelection;

  console.log(`New selection: ${newSelection.name}:`, simState.selected);

  simState.controls.target = newSelection.position;
  simState.controls.object.lookAt(newSelection.position);
  simState.controls.update();
  simState.controls.object.updateProjectionMatrix();
};
export const unselect = () => {
  simState.selected = null;
};

export const setRoot = (root: KeplerBody) => {
  simState.root = root;
};

const updateFn = (deltaTime: number) => {
  return;
};

export const simState = proxy<SimStateObj>({
  root: null!, // root of the Kepler Tree
  selected: null, // current selection
  controls: null!,

  getState: null!,
  update: updateFn,
});
