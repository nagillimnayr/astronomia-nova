import { UiState } from '../ui-state/ui-state';

export class RootStore {
  _uiStateStore: UiState;

  constructor() {
    this._uiStateStore = new UiState(this);
  }
}
