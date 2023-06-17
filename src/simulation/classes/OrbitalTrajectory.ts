import { CatmullRomCurve3, Object3D, Vector3 } from 'three';
import Vec3 from '../types/Vec3';
import { SemiMajorAxis } from '../math/orbital-elements/axes/SemiMajorAxis';
import { cos, pi, sin } from 'mathjs';

type TrajectoryArgs = {
  semiMajorAxis: number;
  semiMinorAxis: number;
  resolution?: number;
};
export class OrbitalTrajectory extends Object3D {
  private _resolution!: number; // number of points
  private _curve!: CatmullRomCurve3;

  constructor(args: TrajectoryArgs) {
    super();
    this._resolution = args.resolution ?? 32;
    const points: Vector3[] = [];

    // parametric equation of an ellipse
    const angle = (2 * pi) / this._resolution;
    for (let i = 0; i < this._resolution; i++) {
      const x = args.semiMajorAxis * cos(angle * i);
      const y = args.semiMajorAxis * sin(angle * i);
      points.push(new Vector3(x, 0, y));
    }

    this._curve = new CatmullRomCurve3(points, true, 'catmullrom');
  }
}
