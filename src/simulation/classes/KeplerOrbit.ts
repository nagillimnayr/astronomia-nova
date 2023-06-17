import { Object3D } from 'three';
import KeplerBody from './KeplerBody';
import { OrbitalElements } from './OrbitalElements';

export class KeplerOrbit extends Object3D {
  private _centralBody!: KeplerBody;
  private _orbitingBody!: KeplerBody;
  private _orbitalElements!: OrbitalElements;

  constructor(elements: OrbitalElements) {
    super();
    this._orbitalElements = elements;
  }

  get centralBody() {
    return this._centralBody;
  }
  set centralBody(body: KeplerBody) {
    this._centralBody = body;
  }

  get orbitingBody() {
    return this._orbitingBody;
  }
  set orbitingBody(body: KeplerBody) {
    this._orbitingBody = body;
  }

  updateOrbitingBody(deltaTime: number) {
    this._orbitingBody.update(deltaTime);
  }
}
