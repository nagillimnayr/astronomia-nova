import type KeplerBody from '@/simulation/classes/kepler-body';
import { type KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import { makeAutoObservable } from 'mobx';
import { type RootStore } from '../root/root-store';

type PrivateKeys = '_rootStore';

export class MapState {
  private _rootStore: RootStore = null!;
  private _bodyMap: Map<string, KeplerBody> = new Map<string, KeplerBody>();
  private _orbitMap: Map<string, KeplerOrbit> = new Map<string, KeplerOrbit>();

  constructor(rootStore: RootStore) {
    makeAutoObservable<this, PrivateKeys>(this, {
      _rootStore: false,
    });

    this._rootStore = rootStore;
  }

  getBody(name: string) {
    return this._bodyMap.get(name);
  }
  addBody(body: KeplerBody) {
    this._bodyMap.set(body.name, body);
  }

  getOrbit(name: string) {
    return this._orbitMap.get(name);
  }
  addOrbit(orbit: KeplerOrbit) {
    this._orbitMap.set(orbit.name, orbit);
  }

  remove(name: string) {
    this._bodyMap.delete(name);
    this._orbitMap.delete(name);
  }

  contains(name: string) {
    return this._bodyMap.has(name);
  }
}
