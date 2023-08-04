import { UPDATES_PER_DAY } from '@/lib/utils/constants';
import { Queue } from '@datastructures-js/queue';
import { flatten, isEqual, clamp, floor } from 'lodash';
import {
  Float32BufferAttribute,
  Line,
  Object3D,
  type Vector3Tuple,
} from 'three';

export class Trail extends Object3D {
  private _points: Queue<Vector3Tuple>;
  private _maxLength: number;
  private _itersPerUpdate = UPDATES_PER_DAY;
  private _iter = 0;
  private _line: Line;

  constructor(itersPerUpdate = UPDATES_PER_DAY, maxLength = 1000) {
    super();
    this._points = new Queue<Vector3Tuple>();
    this._itersPerUpdate = clamp(floor(itersPerUpdate), 1, UPDATES_PER_DAY);
    this._maxLength = maxLength;
    this._line = new Line();
    this.add(this._line);
  }

  get points() {
    return this._points;
  }
  get maxLength() {
    return this._maxLength;
  }
  set maxLength(maxLength: number) {
    this._maxLength = maxLength;
  }

  set itersPerUpdate(itersPerUpdate: number) {
    this._itersPerUpdate = clamp(floor(itersPerUpdate), 1, UPDATES_PER_DAY);
  }

  // Deep compares the current position with the last position added to the queue. If the current position is different, returns true.
  hasMoved(pos: Vector3Tuple) {
    // Get last point.
    const prevPos = this._points.back();
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
    while (this._points.size() >= maxLength) {
      this._points.dequeue();
    }

    // Add current position to the queue.
    this._points.enqueue(pos);

    this.updateLine();
  }

  private updateLine() {
    const points = flatten(this._points.toArray());

    if (points.length < 6) {
      return;
    }

    this._line.geometry.setAttribute(
      'position',
      new Float32BufferAttribute(points, 3)
    );
  }
}
