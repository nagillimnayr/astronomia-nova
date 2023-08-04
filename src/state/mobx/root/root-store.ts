import { rootMachine } from '@/state/xstate/root-machine/root-machine';
import { MapState } from '../domain-state/map-state';
import { SurfaceState } from '../domain-state/surface-state';
import { interpret, type InterpreterFrom } from 'xstate';

export class RootStore {
  private _rootActor: InterpreterFrom<typeof rootMachine>;
  private _mapState: MapState;
  private _surfaceCoords: SurfaceState;

  constructor() {
    this._rootActor = interpret(rootMachine);
    this._rootActor.start();
    this._mapState = new MapState(this);
    this._surfaceCoords = new SurfaceState(this);
  }

  get rootActor() {
    return this._rootActor;
  }
  get mapState() {
    return this._mapState;
  }
  get surfaceCoords() {
    return this._surfaceCoords;
  }
}
