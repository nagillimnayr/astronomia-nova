import { Vector3, Vector3Tuple } from 'three';

const _pos = new Vector3();
const _vel = new Vector3();
const _acc = new Vector3();

export function updateVelocity(
  velocity: Vector3,
  acceleration: Vector3,
  deltaTime: number
): Vector3Tuple {
  _vel.copy(velocity);
  _acc.copy(acceleration);

  _vel.add(_acc.multiplyScalar(deltaTime));
  return _vel.toArray();
}

export function updatePosition(
  position: Vector3,
  velocity: Vector3,
  deltaTime: number
): Vector3Tuple {
  _pos.copy(position);
  _vel.copy(velocity);

  _pos.add(_vel.multiplyScalar(deltaTime));
  return _pos.toArray();
}
