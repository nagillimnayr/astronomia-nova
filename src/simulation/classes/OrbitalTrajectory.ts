import { Object3D } from 'three';

export class OrbitalTrajectory extends Object3D {
  private _resolution!: number; // number of points

  cosntructor() {
    this._resolution = 0;
  }
}
