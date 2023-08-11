import { clamp } from 'lodash';
import { Group, Object3D, Spherical, Vector3 } from 'three';
import { damp, degToRad } from 'three/src/math/MathUtils';

const _xAxis: Readonly<Vector3> = new Vector3(1, 0, 0);
const _yAxis: Readonly<Vector3> = new Vector3(0, 1, 0);
const TWO_PI: Readonly<number> = 2 * Math.PI;
const PI_OVER_TWO: Readonly<number> = Math.PI / 2;
const MAX_PITCH: Readonly<number> = degToRad(87);
const MIN_PITCH: Readonly<number> = -MAX_PITCH;

const lambda = 1;

export class VRCameraController extends Object3D {
  private _player: Group;
  private _distance = 1e4;
  private _minDistance = 1;
  private _maxDistance = 1e9;
  private _pitch = 0;
  private _yaw = 0;
  private _deltaPitch = 0;
  private _deltaYaw = 0;
  private _rotateSpeed = 1;
  private _moveSpeed = 0.75e2;
  private _up: Vector3;
  private _deltaZoom = 0;

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
    this.setDistance(distance);
  }
  setDistance(distance: number) {
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
    this._deltaPitch += pitch;
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
    this._deltaYaw += yaw;
  }

  private updateRotation(deltaTime: number) {
    const newPitch = damp(
      this._pitch,
      this._pitch + this._deltaPitch * this._rotateSpeed,
      lambda,
      deltaTime
    );
    this.setPitch(newPitch);
    // Reset delta pitch.
    this._deltaPitch = 0;

    const newYaw = damp(
      this._yaw,
      this._yaw + this._deltaYaw * this._rotateSpeed,
      lambda,
      deltaTime
    );
    this.setYaw(newYaw);
    // Reset delta yaw.
    this._deltaYaw = 0;
  }

  private updateDistance(deltaTime: number) {
    const zoom = this._deltaZoom * (this._distance / 100) * this._moveSpeed;
    const newDistance = damp(
      this._distance,
      this.distance + zoom,
      lambda,
      deltaTime
    );
    this.setDistance(newDistance);
    this._deltaZoom = 0;
  }

  zoom(zoom: number) {
    this._deltaZoom += zoom;
  }

  update(deltaTime: number) {
    this.rotation.set(0, 0, 0);

    this.updateDistance(deltaTime);
    this.updateRotation(deltaTime);

    this._player.position.set(0, 0, this._distance);

    // Yaw.
    this.rotateOnWorldAxis(this._up, this._yaw);
    // Pitch.
    this.rotateOnAxis(_xAxis, this._pitch);
  }
}
