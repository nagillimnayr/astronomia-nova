import { type Object3D, Vector3 } from 'three';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { CameraControls } from '@react-three/drei';

// global vectors to be reused instead of creating new vectors inside of update loop
const newTargetWorldPos = new Vector3();

type State = {
  controls: CameraControls;
  focusTarget: Object3D | null;
};

type Actions = {
  setCameraControls: (controls: CameraControls) => void;
  updateCameraControls: () => void;
  setFocus: (target: Object3D) => void;
  reset: () => void;
};

const initialState: State = {
  controls: null!,
  focusTarget: null,
};

type CameraStore = State & Actions;

// actions
const setCameraControls = (controls: CameraControls) => {
  console.log('setting camera controls:', controls);
  useCameraStore.setState({ controls: controls });
  controls.mouseButtons.right = 8; // disable pan (set to dolly on right mouse button instead)
};

const updateCameraControls = () => {
  const controls = useCameraStore.getState().controls;
  if (!controls) {
    console.error('camera controls are null');
    return;
  }
  const focusTarget = useCameraStore.getState().focusTarget;
  if (!focusTarget) {
    return;
  }

  // get world position of focus target
  focusTarget.getWorldPosition(newTargetWorldPos);

  // update controls to follow target
  controls.moveTo(...newTargetWorldPos.toArray(), false).catch((reason) => {
    console.log('promise rejected: ', reason);
  });
};

export const useCameraStore = create<CameraStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      // state
      ...initialState,

      // actions
      setCameraControls: setCameraControls,
      updateCameraControls: updateCameraControls,

      setFocus: (target: Object3D) => {
        // console.log('new focus target:', target);
        set({ focusTarget: target });

        // get().updateCameraControls();
      },
      reset: () => {
        console.log('resetting cameraStore');
        set({ ...initialState });
      },
      //
    }))
  )
);
