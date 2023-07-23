import { CameraState } from '../domain-state/camera-state';
import { SurfaceState } from '../domain-state/surface-state';
import { UiState } from '../ui-state/ui-state';

export class RootStore {
  private _uiState: UiState;
  private _cameraState: CameraState;
  private _surfaceState: SurfaceState;

  constructor() {
    this._uiState = new UiState(this);
    this._cameraState = new CameraState(this);
    this._surfaceState = new SurfaceState(this);
  }

  get uiState() {
    return this._uiState;
  }
  get cameraState() {
    return this._cameraState;
  }
}
