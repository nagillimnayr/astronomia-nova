import { type Vector3 } from 'three';

export function updateVelocity(
  velocity: Vector3,
  acceleration: Vector3,
  deltaTime: number
) {
  return velocity.clone().add(acceleration.clone().multiplyScalar(deltaTime));
}

export function updatePosition(
  position: Vector3,
  velocity: Vector3,
  deltaTime: number
) {
  return position.clone().add(velocity.clone().multiplyScalar(deltaTime));
}
