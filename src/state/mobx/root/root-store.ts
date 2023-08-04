import { rootMachine } from '@/state/xstate/root-machine/root-machine';
import { MapState } from '../domain-state/map-state';
import { SurfaceState } from '../domain-state/surface-state';
import { interpret, type InterpreterFrom } from 'xstate';

export class RootStore {
  private _rootMachine: InterpreterFrom<typeof rootMachine>;
  private _mapState: MapState;
  private _surfaceCoords: SurfaceState;

  constructor() {
    this._rootMachine = interpret(rootMachine);
    this._rootMachine.start();
    this._mapState = new MapState(this);
    this._surfaceCoords = new SurfaceState(this);
  }

  get rootMachine() {
    return this._rootMachine;
  }
  get mapState() {
    return this._mapState;
  }
  get surfaceCoords() {
    return this._surfaceCoords;
  }
}
