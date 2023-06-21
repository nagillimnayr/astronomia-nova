import { CameraControls } from '@react-three/drei';
import { simState } from './SimState';
import { proxy } from 'valtio';
import Vec3 from '../types/Vec3';
import { Object3D } from 'three';

type CamStateObj = {
  controls: CameraControls;
  focusTarget: Object3D | null;

  setControls: (controls: CameraControls) => void;
  updateControls: () => void;
};

const setControls = (controls: CameraControls) => {
  camState.controls = controls;
  controls.mouseButtons.right = 1; // disable pan (set to rotate on right mouse button instead)
  controls.addEventListener('update', camState.updateControls);
  camState.updateControls();
};

const updateControls = () => {
  if (!camState.controls) {
    return;
  }
  if (!camState.focusTarget) return;

  const targetPos: Vec3 = camState.focusTarget.position.toArray();

  // update controls to follow target
  camState.controls.setTarget(...targetPos, true).catch((reason) => {
    console.log('promise rejected: ', reason);
  });
};

export const camState = proxy<CamStateObj>({
  controls: null!,
  focusTarget: null,

  setControls,
  updateControls,
});
