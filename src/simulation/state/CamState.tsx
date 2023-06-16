import { CameraControls } from '@react-three/drei';
import { CameraControls as CamControls } from 'three-stdlib';
import { simState } from './SimState';
import { proxy } from 'valtio';
import Vec3 from '../types/Vec3';

type CamStateObj = {
  controls: CameraControls;

  setControls: (controls: CameraControls) => void;
  updateControls: () => void;
};

const setControls = (controls: CameraControls) => {
  camState.controls = controls;
  controls.mouseButtons.right = 0; // disable pan
  controls.addEventListener('update', camState.updateControls);
  camState.updateControls();
};

const updateControls = () => {
  if (!camState.controls) {
    return;
  }
  let targetPos: Vec3 = [0, 0, 0];
  if (simState.selected) {
    // if no selection, focus on origin
    targetPos = simState.selected.position.toArray();
  }
  // update controls to follow target
  camState.controls.setTarget(...targetPos, true).catch((reason) => {
    console.log('promise rejected: ', reason);
  });
};

export const camState = proxy<CamStateObj>({
  controls: null!,
  setControls,
  updateControls,
});
