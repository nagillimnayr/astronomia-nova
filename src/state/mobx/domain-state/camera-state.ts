import { makeAutoObservable } from 'mobx';
import { type RootStore } from '../root/root-store';
import type KeplerBody from '@/simulation/classes/KeplerBody';
import { makeLoggable } from 'mobx-log';
import { type Object3D, Vector3, Spherical, Sphere } from 'three';
import { CameraControls } from '@react-three/drei';

// global vector to be reused instead of creating new vector inside of update loop
const targetWorldPos = new Vector3();
const _sphere = new Sphere();

type ViewState = 'space' | 'surface';

const initialState = {
  controls: null!,
  focusTarget: null,
  viewState: 'space' as ViewState,
};

type PrivateKeys =
  | '_rootStore'
  | '_controls'
  | 'updateSpaceView'
  | 'updateSurfaceView';
export class CameraState {
  private _rootStore: RootStore = null!;
  private _controls: CameraControls = initialState.controls;
  private _focusTarget: Object3D | null = initialState.focusTarget;
  private _viewState: ViewState = initialState.viewState;

  constructor(rootStore: RootStore) {
    // Set MobX annotations.
    makeAutoObservable<this, PrivateKeys>(this, {
      _rootStore: false,
      _controls: false, // Don't want to track as it will be updated each frame.
      updateCamera: false,
      updateSpaceView: false,
      updateSurfaceView: false,
    });
    makeLoggable(this);

    this._rootStore = rootStore;
  }

  get rootStore() {
    return this._rootStore;
  }

  get controls() {
    return this._controls;
  }

  setControls(controls: CameraControls) {
    if (controls === this._controls) return;
    console.log('setting controls!');
    this._controls = controls;
    this._controls.mouseButtons.right = 8;
  }

  get focusTarget() {
    return this._focusTarget;
  }

  setFocus(target: Object3D) {
    this._focusTarget = target;
    // this._focusTarget.add(this._controls.camera);
    // this._controls.updateCameraUp();
    // this._controls.applyCameraUp();

    // Get world position of focus target.
    // this._focusTarget.getWorldPosition(targetWorldPos);

    // Update controls to follow target.
    // this._controls
    //   .moveTo(...targetWorldPos.toArray(), false)
    //   .catch((reason) => {
    //     console.log('error updating camera controls: ', reason);
    //   });

    // _sphere.set(targetWorldPos, 100);
    // this._controls.fitToSphere(_sphere, false).catch((reason) => {
    //   console.log('error updating camera controls: ', reason);
    // });
  }

  get viewState() {
    return this._viewState;
  }

  setViewState(viewState: ViewState) {
    this._viewState = viewState;
  }

  updateCamera(deltaTime: number) {
    switch (this._viewState) {
      case 'space': {
        this.updateSpaceView(deltaTime);
        break;
      }

      case 'surface': {
        this.updateSurfaceView(deltaTime);
        break;
      }
    }
  }
  private updateSpaceView(deltaTime: number) {
    if (!this._controls) {
      console.error('camera controls are null');
      return;
    }
    if (!this._focusTarget) {
      return;
    }

    // Get world position of focus target.
    this._focusTarget.getWorldPosition(targetWorldPos);

    // // Update controls to follow target.
    this._controls
      .moveTo(...targetWorldPos.toArray(), false)
      .catch((reason) => {
        console.log('error updating camera controls: ', reason);
      });

    // this._controls
    //   .setTarget(...targetWorldPos.toArray(), false)
    //   .catch((reason) => {
    //     console.log('error updating camera controls: ', reason);
    //   });

    // _sphere.set(targetWorldPos, 100);
    // this._controls.fitToSphere(_sphere, false).catch((reason) => {
    //   console.log('error updating camera controls: ', reason);
    // });

    this._controls.update(deltaTime);
  }
  private updateSurfaceView(deltaTime: number) {
    // Do something...}
  }
}
