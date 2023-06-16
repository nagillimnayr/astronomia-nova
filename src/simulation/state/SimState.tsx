import { Object3D } from 'three';
import { proxy } from 'valtio';
import KeplerBody from '../classes/KeplerBody';
//import { OrbitControls, CameraControls } from 'three-stdlib';
import { CameraControls } from '@react-three/drei';
import { RootState } from '@react-three/fiber';
import { camState } from './CamState';

type SimStateObj = {
  root: KeplerBody;
  selected: KeplerBody | null;
  //controls: CameraControls;

  getState: () => RootState;
  update: (deltaTime: number) => void;
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

  // set camera controls target
  // simState.controls.setTarget(...newSelection.position.toArray(), true).then(
  //   () => {
  //     console.log('promise fulfilled!');
  //   },
  //   (reason) => {
  //     console.log('promise rejected!: ', reason);
  //   }
  // );
  //simState.controls.object.lookAt(newSelection.position);
  //simState.controls.update();
  //simState.controls.object.updateProjectionMatrix();
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

  getState: null!,
  update: updateFn,
});
