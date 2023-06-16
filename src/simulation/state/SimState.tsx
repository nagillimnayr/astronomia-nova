import { Object3D } from 'three';
import { proxy } from 'valtio';
import KeplerBody from '../classes/KeplerBody';

type SimStateObj = {
  selected: KeplerBody | null;
};
export const SimState = proxy<SimStateObj>({
  selected: null,
});

export const select = (newSelection: KeplerBody) => {
  if (!newSelection) {
    unselect();
    return;
  }

  SimState.selected = newSelection;

  console.log(`New selection: ${newSelection.name}:`, SimState.selected);
};
export const unselect = () => {
  SimState.selected = null;
};
