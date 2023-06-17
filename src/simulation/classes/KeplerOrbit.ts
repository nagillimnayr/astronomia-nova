import { Object3D } from 'three';
import KeplerBody from './KeplerBody';
import { OrbitalElements } from './OrbitalElements';
import { OrbitalTrajectory } from './OrbitalTrajectory';

export class KeplerOrbit extends Object3D {
  private _centralBody!: KeplerBody;
  private _orbitingBody!: KeplerBody;
  private _orbitalElements!: OrbitalElements;
  private _trajectory!: OrbitalTrajectory;

  constructor(
    centralBody: KeplerBody,
    orbitingBody: KeplerBody,
    elements: OrbitalElements
  ) {
    super();
    this._orbitalElements = elements;
    this._centralBody = centralBody;
    this._orbitingBody = orbitingBody;

    this._trajectory = new OrbitalTrajectory({
      semiMajorAxis: this._orbitalElements.semiMajorAxis,
      semiMinorAxis: this._orbitalElements.semiMinorAxis,
    });

    // attach orbit to centralBody
    this._centralBody.add(this);
    // attach orbiting body to orbit
    this.add(this._orbitingBody);
  }

  get centralBody() {
    return this._centralBody;
  }
  // set centralBody(body: KeplerBody) {
  //   this._centralBody = body;
  // }

  get orbitingBody() {
    return this._orbitingBody;
  }
  // set orbitingBody(body: KeplerBody) {
  //   this._orbitingBody = body;
  // }

  updateOrbitingBody(deltaTime: number) {
    this._orbitingBody.update(deltaTime);
  }
}
