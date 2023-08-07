import { UPDATES_PER_DAY } from '@/lib/utils/constants';
import { Queue } from '@datastructures-js/queue';
import { flatten, isEqual, clamp, floor } from 'lodash';
import {
  ColorRepresentation,
  Float32BufferAttribute,
  Line,
  Mesh,
  Object3D,
  Vector2,
  Vector2Tuple,
  type Vector3Tuple,
} from 'three';

import {
  MeshLineGeometry as MeshLineGeometryImpl,
  MeshLineMaterial,
} from 'meshline';
import { Size } from '@react-three/fiber';

type Params = {
  resolution?: Vector2Tuple;
  itersPerUpdate?: number;
  maxLength?: number;
  width?: number;
  color?: ColorRepresentation;
};
export class Trail extends Mesh {
  private _pointsQueue: Queue<Vector3Tuple>;
  private _maxLength: number;
  private _itersPerUpdate = UPDATES_PER_DAY;
  private _iter = 0;
  // private _line: Line;

  constructor(
    resolution = [100, 100],
    itersPerUpdate = UPDATES_PER_DAY,
    maxLength = 1000,
    width = 1,
    color = 'white'
  ) {
    super(
      new MeshLineGeometryImpl(),
      new MeshLineMaterial({
        lineWidth: width,
        color,
        // sizeAttenuation: 1,
        resolution: new Vector2(...resolution),
      })
    );
    this._pointsQueue = new Queue<Vector3Tuple>();
    this._itersPerUpdate = clamp(floor(itersPerUpdate), 1, UPDATES_PER_DAY);
    this._maxLength = maxLength;
    // this._line = new Line();
    // this.add(this._line);
  }

  get points() {
    return this._pointsQueue;
  }
  get maxLength() {
    return this._maxLength;
  }
  set maxLength(maxLength: number) {
    this._maxLength = maxLength;
  }

  set color(color: ColorRepresentation) {
    if (!(this.material instanceof MeshLineMaterial)) return;
    this.material.color.set(color);
  }

  setLineWidth(lineWidth: number) {
    if (!(this.material instanceof MeshLineMaterial)) return;
    this.material.lineWidth = lineWidth;
  }
  set lineWidth(lineWidth: number) {
    this.setLineWidth(lineWidth);
  }

  set itersPerUpdate(itersPerUpdate: number) {
    this._itersPerUpdate = clamp(floor(itersPerUpdate), 1, UPDATES_PER_DAY);
  }

  setResolution(x: number, y: number) {
    if (!(this.material instanceof MeshLineMaterial)) return;
    this.material.resolution.set(x, y);
  }

  // Deep compares the current position with the last position added to the queue. If the current position is different, returns true.
  hasMoved(pos: Vector3Tuple) {
    // Get last point.
    const prevPos = this._pointsQueue.back();
    if (!prevPos) return true;

    if (!isEqual(prevPos[0], pos[0])) return true;
    if (!isEqual(prevPos[1], pos[1])) return true;
    if (!isEqual(prevPos[2], pos[2])) return true;
    return false;
  }

  update(pos: Vector3Tuple) {
    if (!pos) return;
    // Check if has moved.
    if (!this.hasMoved(pos)) return;

    // Increment iteration count.
    this._iter++;
    if (this._iter < this._itersPerUpdate) return;
    // Reset iteration count.
    this._iter = 0;

    const updatesPerDay = floor(UPDATES_PER_DAY / this._itersPerUpdate);
    const maxLength = this._maxLength * updatesPerDay;
    // Dequeue points until under max length.
    while (this._pointsQueue.size() >= maxLength) {
      this._pointsQueue.dequeue();
    }

    // Add current position to the queue.
    this._pointsQueue.enqueue(pos);

    this.updateLine();
  }

  private updateLine() {
    const points = flatten(this._pointsQueue.toArray());

    if (points.length < 6) {
      return;
    }

    // this._line.geometry.setAttribute(
    //   'position',
    //   new Float32BufferAttribute(points, 3)
    // );

    if (this.geometry instanceof MeshLineGeometryImpl) {
      this.geometry.setPoints(points);
      return;
    }

    this.geometry.setAttribute(
      'position',
      new Float32BufferAttribute(points, 3)
    );
  }
}
