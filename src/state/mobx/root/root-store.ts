import { MapState } from '../domain-state/map-state';
import { SurfaceState } from '../domain-state/surface-state';

export class RootStore {
  private _mapState: MapState;
  private _surfaceCoords: SurfaceState;

  constructor() {
    this._mapState = new MapState(this);
    this._surfaceCoords = new SurfaceState(this);
  }

  get mapState() {
    return this._mapState;
  }
  get surfaceCoords() {
    return this._surfaceCoords;
  }
}
