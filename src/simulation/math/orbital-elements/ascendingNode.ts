import { Vector3 } from 'three';

const _ascendingNode = new Vector3();
export function calculateAscendingNode(
  specificAngularMomentum: Vector3,
  zAxis: Vector3
) {
  return _ascendingNode.crossVectors(specificAngularMomentum, zAxis);
}
