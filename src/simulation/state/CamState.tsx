import { CameraControls } from '@react-three/drei';
import { simState } from './SimState';
import { proxy } from 'valtio';

type CamStateObj = {
  controls: CameraControls;

  setControls: (controls: CameraControls) => void;
  updateControls: () => void;
};

const setControls = (controls: CameraControls) => {
  camState.controls = controls;
  //controls.addEventListener('update', updateControls);
};

const updateControls = () => {
  if (!camState.controls || !simState.selected) {
    return;
  }

  // update controls to follow target
  camState.controls
    .setTarget(...simState.selected.position.toArray(), true)
    .catch((reason) => {
      console.log('promise rejected: ', reason);
    });
};

export const camState = proxy<CamStateObj>({
  controls: null!,
  setControls,
  updateControls,
});
