import { CameraControls } from '@react-three/drei';
import { simState } from './SimState';
import { proxy } from 'valtio';
import Vec3 from '../types/Vec3';
import { Camera, Object3D, Vector3, Vector3Tuple } from 'three';
import { OrbitControls } from 'three-stdlib';
import { Instance } from '@react-three/fiber/dist/declarations/src/core/renderer';

const worldPos = new Vector3();

type CamStateObj = {
  controls: CameraControls;
  controlsInstance: Instance;
  marker: Object3D;
  focusTarget: Object3D | null;

  setControls: (controls: CameraControls) => void;
  setControlsInstance: (instance: Instance) => void;
  updateControls: () => void;
  setFocus: (target: Object3D) => void;
};

const setControls = (controls: CameraControls) => {
  camState.controls = controls;
  controls.mouseButtons.right = 8; // disable pan (set to dolly on right mouse button instead)
  // controls.addEventListener('update', camState.updateControls);
  // camState.updateControls();
};
const setControlsInstance = (instance: Instance) => {
  camState.controlsInstance = instance;
};

const updateControls = () => {
  // if (!camState.controls) {
  //   return;
  // }
  // if (!camState.focusTarget) return;
  // // const worldPos = new Vector3();
  // // camState.focusTarget.updateMatrixWorld(true); // update world matrix of target
  // camState.focusTarget.getWorldPosition(worldPos);
  // const targetPos: Vector3Tuple = worldPos.toArray();
  // // update controls to follow target
  // camState.controls.setTarget(...targetPos, false).catch((reason) => {
  //   console.log('promise rejected: ', reason);
  // });
};

const setFocus = (target: Object3D) => {
  if (!target) return;

  console.log('new focus target:', target);
  camState.focusTarget = target;
  // attach camera to target
  // body.add(camState.controls.camera);
  const state = simState.getState();
  const camera = state.camera;
  const temp: unknown = state.controls as unknown;
  const controls: CameraControls = temp as CameraControls;

  // target.add(camera);

  // console.log('camera:', camera);
  // console.log('controls:', controls);

  // update controls to follow target
  if (!camState.focusTarget) return;
  const worldPos = new Vector3();
  camState.focusTarget.getWorldPosition(worldPos);
  const targetPos: Vec3 = worldPos.toArray();
  controls.setTarget(...targetPos, false).catch((reason) => {
    console.log('promise rejected: ', reason);
  });

  // camState.controls
  //   .setTarget(...targetPos, true)
  //   .then(() => {
  //     camState.isTransitioning = false;
  //   })
  //   .catch((reason) => {
  //     console.log('promise rejected: ', reason);
  //   });

  camState.updateControls();
};

export const camState = proxy<CamStateObj>({
  controls: null!,
  controlsInstance: null!,
  marker: null!,
  focusTarget: null,

  setControls,
  setControlsInstance,
  updateControls,
  setFocus,
});
