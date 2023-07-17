import {
  makeAutoObservable,
  makeObservable,
  observable,
  computed,
  action,
} from 'mobx';
import { RootStore } from '../root/root-store';

const initialState = {
  isOutlinerOpen: true,
  isDebugPanelOpen: false,
};

type PrivateKeys = '_rootStore' | '_isOutlinerOpen' | '_isDebugPanelOpen';

export class UiState {
  private _isOutlinerOpen: boolean;
  private _isDebugPanelOpen: boolean;
  private _rootStore: RootStore;

  constructor(rootStore: RootStore) {
    // Set MobX annotations.
    makeAutoObservable<typeof this, PrivateKeys>(this, {
      _rootStore: false,
      _isOutlinerOpen: observable,
      _isDebugPanelOpen: observable,
    });

    // Set reference to root store.
    this._rootStore = rootStore;

    // Set initial state.
    this._isOutlinerOpen = initialState.isOutlinerOpen;
    this._isDebugPanelOpen = initialState.isDebugPanelOpen;
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
