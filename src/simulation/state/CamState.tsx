import { CameraControls } from '@react-three/drei';
import { simState } from './SimState';
import { proxy } from 'valtio';
import Vec3 from '../types/Vec3';
import { Object3D, Vector3 } from 'three';

type CamStateObj = {
  controls: CameraControls;
  focusTarget: Object3D | null;

  isTransitioning: boolean;

  setControls: (controls: CameraControls) => void;
  updateControls: () => void;
  setFocus: (target: Object3D) => void;
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

  const worldPos = new Vector3();
  camState.focusTarget.getWorldPosition(worldPos);
  const targetPos: Vec3 = worldPos.toArray();

  // update controls to follow target
  camState.controls.setTarget(...targetPos, false).catch((reason) => {
    console.log('promise rejected: ', reason);
  });
};

const setFocus = (target: Object3D) => {
  camState.focusTarget = target;
  if (!target) return;

  target.attach(camState.controls.camera);
  camState.updateControls();
};

export const camState = proxy<CamStateObj>({
  controls: null!,
  focusTarget: null,

  isTransitioning: false,

  setControls,
  updateControls,
  setFocus,
});
