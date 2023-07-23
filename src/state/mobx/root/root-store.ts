import { CameraState } from '../domain-state/camera-state';
import { UiState } from '../ui-state/ui-state';

export class RootStore {
  private _uiState: UiState;
  private _cameraState: CameraState;

  constructor() {
    this._uiState = new UiState(this);
    this._cameraState = new CameraState(this);
  }

  get uiState() {
    return this._uiState;
  }
  get cameraState() {
    return this._cameraState;
  }
}
