import { makeAutoObservable, toJS } from 'mobx';
import { type RootStore } from '../root/root-store';
import type KeplerBody from '@/simulation/classes/KeplerBody';
import { makeLoggable } from 'mobx-log';

const initialState = {
  isOutlinerOpen: true,
  isDebugPanelOpen: false,
  selected: null,
};

export class UiState {
  private _rootStore: RootStore = null!;
  private _isOutlinerOpen: boolean = initialState.isOutlinerOpen;
  private _isDebugPanelOpen: boolean = initialState.isDebugPanelOpen;

  private _selected: KeplerBody | null = null; // Will be null if no object is selected.

  constructor(rootStore: RootStore) {
    // Set MobX annotations.
    makeAutoObservable<this, '_rootStore'>(this, {
      _rootStore: false,
    });
    makeLoggable(this);

    // Set reference to root store.
    this._rootStore = rootStore;
  }

  get isOutlinerOpen() {
    return this._isOutlinerOpen;
  }

  get isDebugPanelOpen() {
    return this._isDebugPanelOpen;
  }

  get selected() {
    return this._selected;
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

  select(body: KeplerBody) {
    if (this._selected === body) return; // Already selected? Do nothing.
    console.log('new selection:', toJS(body));
    this._selected = body;
  }

  deselect() {
    this._selected = null;
  }

  getSelected() {
    return this.selected;
  }

  reset() {
    // Reset to initial state.
    this._isOutlinerOpen = initialState.isOutlinerOpen;
    this._isDebugPanelOpen = initialState.isDebugPanelOpen;
  }

  toJSON() {
    return toJS(this);
  }
}
