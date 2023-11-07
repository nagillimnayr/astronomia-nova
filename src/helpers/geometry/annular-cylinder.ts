import { TWO_PI } from '@/constants';
import {
  Shape,
  Path,
  ExtrudeGeometry,
  type ExtrudeGeometryOptions,
} from 'three';

export function makeAnnularCylinderGeometry(
  outerRadius: number,
  innerRadius: number,
  extrudeOptions: ExtrudeGeometryOptions
) {
  const arcShape = new Shape();
  const holePath = new Path();

  arcShape.absarc(0, 0, outerRadius, 0, TWO_PI, false);
  holePath.absarc(0, 0, innerRadius, 0, TWO_PI, false);
  holePath.closePath();
  arcShape.holes.push(holePath);
  arcShape.closePath();

  return new ExtrudeGeometry(arcShape, extrudeOptions);
}
