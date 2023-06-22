import { proxy } from 'valtio';
import type KeplerBody from '../classes/KeplerBody';
import { camState } from './CamState';

type SelectStateObj = {
  selected: KeplerBody | null;

  select: (newSelection: KeplerBody) => void;
  deselect: () => void;
};

const select = (newSelection: KeplerBody) => {
  if (!newSelection) {
    //unselect();
    return;
  }

  // set selected
  selectState.selected = newSelection;

  console.log(`New selection: ${newSelection.name}:`, selectState.selected);

  camState.controls.update(0.01); // update controls to follow target
};
const deselect = () => {
  selectState.selected = null;
};

export const selectState = proxy<SelectStateObj>({
  selected: null,
  select,
  deselect,
});
