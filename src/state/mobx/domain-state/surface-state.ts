import { makeAutoObservable } from 'mobx';
import { type RootStore } from '../root/root-store';

export class SurfaceState {
  private _rootStore: RootStore = null!;
  private _latitude = 0;
  private _longitude = 0;

  constructor(rootStore: RootStore) {
    makeAutoObservable<this>(this);

    this._rootStore = rootStore;
  }

  setLatitude(value: number) {
    this._latitude = value;
  }
  set latitude(value: number) {
    this._latitude = value;
  }
  get latitude() {
    return this._latitude;
  }

  setLongitude(value: number) {
    this._longitude = value;
  }
  set longitude(value: number) {
    this._longitude = value;
  }
  get longitude() {
    return this._longitude;
  }
}
