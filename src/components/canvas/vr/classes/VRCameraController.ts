import { clamp } from 'lodash';
import { Group, Object3D, Spherical, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const _xAxis: Readonly<Vector3> = new Vector3(1, 0, 0);
const _yAxis: Readonly<Vector3> = new Vector3(0, 1, 0);
const TWO_PI: Readonly<number> = 2 * Math.PI;
const PI_OVER_TWO: Readonly<number> = Math.PI / 2;
const MAX_PITCH: Readonly<number> = degToRad(87);
const MIN_PITCH: Readonly<number> = -MAX_PITCH;

export class VRCameraController extends Object3D {
  private _player: Group;
  private _distance = 1e4;
  private _minDistance = 1;
  private _maxDistance = 1e9;
  private _pitch = 0;
  private _yaw = 0;
  private _rotateSpeed = 1;
  private _moveSpeed = 1;
  private _up: Vector3;

  constructor(player: Group) {
    super();
    this._player = player;
    const parent = player.parent;
    this.add(player);
    if (parent) {
      parent.add(this);
    }
    this._up = new Vector3().copy(_yAxis);
  }

  get player() {
    return this._player;
  }

  // set player(player: Group) {
  //   this._player = player;
  // }

  get minDistance() {
    return this._minDistance;
  }

  set minDistance(val: number) {
    this._minDistance = val;
  }

  get maxDistance() {
    return this._maxDistance;
  }

  set maxDistance(val: number) {
    this._maxDistance = val;
  }

  get distance() {
    return this._distance;
  }
  set distance(distance: number) {
    this._distance = clamp(distance, this._minDistance, this._maxDistance);
  }

  get pitch() {
    return this._pitch;
  }
  setPitch(pitch: number) {
    const adjustedAngle = clamp(pitch, MIN_PITCH, MAX_PITCH);
    this._pitch = adjustedAngle;
  }
  addPitch(pitch: number) {
    this.setPitch(this._pitch + pitch * this._rotateSpeed);
  }

  get yaw() {
    return this._yaw;
  }
  setYaw(yaw: number) {
    let adjustedAngle = yaw;
    while (adjustedAngle > TWO_PI) {
      adjustedAngle -= TWO_PI;
    }
    while (adjustedAngle < 0) {
      adjustedAngle += TWO_PI;
    }
    this._yaw = adjustedAngle;
  }

  addYaw(yaw: number) {
    this.setYaw(this._yaw + yaw * this._rotateSpeed);
  }

  update(deltaTime: number) {
    this.rotation.set(0, 0, 0);
    this._player.position.set(0, 0, this._distance);

    // Yaw.
    this.rotateOnWorldAxis(this._up, this._yaw);
    // Pitch.
    this.rotateOnAxis(_xAxis, this._pitch);
  }
}
