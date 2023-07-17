import { makeAutoObservable, observable, toJS } from 'mobx';
import { type RootStore } from '../root/root-store';

const initialState = {
  isOutlinerOpen: true,
  isDebugPanelOpen: false,
};

// Type alias for private keys. To pass to makeAutoObservable.
type PrivateKeys = '_rootStore' | '_isOutlinerOpen' | '_isDebugPanelOpen';

export class UiState {
  private _isOutlinerOpen: boolean = initialState.isOutlinerOpen;
  private _isDebugPanelOpen: boolean = initialState.isDebugPanelOpen;
  private _rootStore: RootStore;

  constructor(rootStore: RootStore) {
    // Set MobX annotations.
    makeAutoObservable<this, PrivateKeys>(this, {
      _rootStore: false,
      _isOutlinerOpen: observable,
      _isDebugPanelOpen: observable,
    });

    // Set reference to root store.
    this._rootStore = rootStore;
  }

  get isOutlinerOpen() {
    return this._isOutlinerOpen;
  }

  get isDebugPanelOpen() {
    return this._isDebugPanelOpen;
  }

  openOutliner() {
    this._isOutlinerOpen = true;
  }
  closeOutliner() {
    this._isOutlinerOpen = false;
  }
  toggleOutliner() {
    this._isOutlinerOpen = !this._isOutlinerOpen;
  }

  openDebugPanel() {
    this._isDebugPanelOpen = true;
  }
  closeDebugPanel() {
    this._isDebugPanelOpen = false;
  }

  reset() {
    // Reset to initial state.
    this._isOutlinerOpen = initialState.isOutlinerOpen;
    this._isDebugPanelOpen = initialState.isDebugPanelOpen;
  }
}
