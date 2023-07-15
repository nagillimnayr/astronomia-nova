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

export const useCameraStore = create<CameraStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      // state
      ...initialState,

      // actions
      setCameraControls: (controls: CameraControls) => {
        console.log('setting camera controls:', controls);
        set({ controls: controls });
        controls.mouseButtons.right = 8; // disable pan (set to dolly on right mouse button instead)
      },
      updateCameraControls: () => {
        const controls = get().controls;
        if (!controls) {
          console.error('camera controls are null');
          return;
        }
        const focusTarget = get().focusTarget;
        if (!focusTarget) {
          return;
        }

        // get world position of focus target
        focusTarget.getWorldPosition(newTargetWorldPos);

        // update controls to follow target
        controls
          .moveTo(...newTargetWorldPos.toArray(), false)
          .catch((reason) => {
            console.log('promise rejected: ', reason);
          });
      },
      setFocus: (target: Object3D) => {
        console.log('new focus target:', target);
        set({ focusTarget: target });

        // attach camera to target
        // target.add(get().controls.camera);

        get().updateCameraControls();
      },
      reset: () => {
        console.log('resetting cameraStore');
        set({ ...initialState });
      },
      //
    }))
  )
);
