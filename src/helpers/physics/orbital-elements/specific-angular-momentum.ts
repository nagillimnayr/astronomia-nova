import { Vector3 } from 'three';

const _vec = new Vector3();

export function calculateSpecificAngularMomentum(
  position: Vector3,
  velocity: Vector3
) {
  return _vec.crossVectors(position, velocity).toArray();
}
