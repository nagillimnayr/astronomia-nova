import { Object3D } from 'three';
import { proxy } from 'valtio';
import KeplerBody, { traverseTree } from '../classes/KeplerBody';
//import { OrbitControls, CameraControls } from 'three-stdlib';
import { CameraControls } from '@react-three/drei';
import { RootState } from '@react-three/fiber';
import { camState } from './CamState';
import { makeFixedUpdateFn } from '../systems/FixedTimeStep';
import { DAY } from '../utils/constants';

type SimStateObj = {
  selected: KeplerBody | null;
  //controls: CameraControls;

  select: (newSelection: KeplerBody) => void;
  deselect: () => void;

  getState: () => RootState;
};

export const select = (newSelection: KeplerBody) => {
  if (!newSelection) {
    //unselect();
    return;
  }

  // set selected
  simState.selected = newSelection;

  console.log(`New selection: ${newSelection.name}:`, simState.selected);

  camState.controls.update(0.01); // update controls to follow target
};
export const deselect = () => {
  simState.selected = null;
};

export const simState = proxy<SimStateObj>({
  selected: null, // current selection
  select,
  deselect,
  getState: null!,
});
