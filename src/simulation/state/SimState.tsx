import { Object3D } from 'three';
import { proxy } from 'valtio';
import KeplerBody from '../classes/KeplerBody';
import { OrbitControls } from 'three-stdlib';

type SimStateObj = {
  root: KeplerBody;
  selected: KeplerBody | null;
  controls: OrbitControls;

  update: (deltaTime: number) => void;
};

export const select = (newSelection: KeplerBody) => {
  if (!newSelection) {
    unselect();
    return;
  }

  SimState.selected = newSelection;

  console.log(`New selection: ${newSelection.name}:`, SimState.selected);

  SimState.controls.target = newSelection.position;
  SimState.controls.object.lookAt(newSelection.position);
  SimState.controls.update();
  SimState.controls.object.updateProjectionMatrix();
};
export const unselect = () => {
  SimState.selected = null;
};

export const setRoot = (root: KeplerBody) => {
  SimState.root = root;
};

const updateFn = (deltaTime: number) => {
  return;
};

export const SimState = proxy<SimStateObj>({
  root: null!, // root of the Kepler Tree
  selected: null, // current selection
  controls: null!,
  update: updateFn,
});
