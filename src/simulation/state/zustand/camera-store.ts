import { type Object3D, Vector3 } from 'three';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { CameraControls } from '@react-three/drei';

// global vectors to be reused instead of creating new vectors inside of update loop
const newTargetWorldPos = new Vector3();

type State = {
  controls: CameraControls;
  focusTarget: Object3D | null;
  viewState: 'space' | 'surface';
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
  viewState: 'space',
};

type CameraStore = State & Actions;

// actions
const setCameraControls = (controls: CameraControls) => {
  console.log('setting camera controls:', controls);
  useCameraStore.setState({ controls: controls });
  controls.mouseButtons.right = 8; // Disable pan. (set to dolly on right mouse button instead)
};

const updateCameraControls = () => {
  const viewState = useCameraStore.getState().viewState;

  switch (viewState) {
    case 'space': {
      updateSpaceView();
      break;
    }

    case 'surface': {
      updateSurfaceView();
      break;
    }

    default: {
      throw new Error(
        `error: This shouldn't be possible! Something has gone wrong!`
      );
    }
  }
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
        console.log('new focus target:', target);
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

// These functions are kept external to the store object so that they are module scoped and the user can't call them directly. Instead, the updateCameraControls() function should be called on the store, and that function will decide which of these to call depending on the viewState.
function updateSpaceView() {
  // Get camera controls.
  const controls = useCameraStore.getState().controls;
  if (!controls) {
    console.error('camera controls are null');
    return;
  }
  // Get focus target.
  const focusTarget = useCameraStore.getState().focusTarget;
  if (!focusTarget) {
    return;
  }

  // Get world position of focus target.
  focusTarget.getWorldPosition(newTargetWorldPos);

  // Update controls to follow target.
  controls.moveTo(...newTargetWorldPos.toArray(), false).catch((reason) => {
    console.log('promise rejected: ', reason);
  });
}

function updateSurfaceView() {
  // Do something...
}
