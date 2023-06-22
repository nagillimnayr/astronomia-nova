import { CameraControls } from '@react-three/drei';
import { simState } from './SimState';
import { proxy } from 'valtio';
import Vec3 from '../types/Vec3';
import { Camera, Object3D, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';

type CamStateObj = {
  controls: CameraControls;
  marker: Object3D;
  focusTarget: Object3D | null;

  isTransitioning: boolean;

  setControls: (controls: CameraControls) => void;
  updateControls: () => void;
  setFocus: (target: Object3D) => void;
};

const setControls = (controls: CameraControls) => {
  camState.controls = controls;
  // controls.mouseButtons.right = 1; // disable pan (set to rotate on right mouse button instead)
  // controls.addEventListener('update', camState.updateControls);
  // camState.updateControls();
};

let isTransitioning = false;
const updateControls = () => {
  if (!camState.controls) {
    return;
  }
  if (!camState.focusTarget) return;
  // if (isTransitioning) return;
  const worldPos = new Vector3();
  camState.focusTarget.getWorldPosition(worldPos);
  const targetPos: Vec3 = worldPos.toArray();

  // update controls to follow target
  camState.controls.setTarget(...targetPos, false).catch((reason) => {
    console.log('promise rejected: ', reason);
  });
};

const setFocus = (target: Object3D) => {
  if (!target) return;

  const body = target.parent!.parent!;
  camState.focusTarget = body;
  // attach camera to target
  // body.add(camState.controls.camera);
  body.add(camState.controls.camera);

  // update controls to follow target
  if (!camState.focusTarget) return;
  const worldPos = new Vector3();
  camState.focusTarget.getWorldPosition(worldPos);
  const targetPos: Vec3 = worldPos.toArray();
  isTransitioning = true;
  camState.controls
    .setTarget(...targetPos, true)
    .then(() => {
      isTransitioning = false;
    })
    .catch((reason) => {
      console.log('promise rejected: ', reason);
    });

  camState.updateControls();
};

export const camState = proxy<CamStateObj>({
  controls: null!,
  marker: null!,
  focusTarget: null,

  isTransitioning: false,

  setControls,
  updateControls,
  setFocus,
});
