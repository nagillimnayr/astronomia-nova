import { Object3D } from 'three';
import Vec3 from '../types/Vec3';
export class OrbitalTrajectory extends Object3D {
  private _resolution!: number; // number of points
  private _points!: Vec3[]; // array of points
  cosntructor() {
    this._resolution = 0;
    this._points = [];
  }
}
