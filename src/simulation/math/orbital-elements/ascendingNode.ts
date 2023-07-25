import { Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';

const _orbitPlaneNormal = new Vector3();
const _ascendingNode = new Vector3();
export function calculateAscendingNode(
  specificAngularMomentum: Vector3,
  zAxis: Vector3 // Z-Axis of the reference frame.
) {
  _orbitPlaneNormal.copy(specificAngularMomentum).normalize();
  return _ascendingNode.crossVectors(_orbitPlaneNormal, zAxis).toArray();
}

export function calculateLongitudeOfAscendingNode(
  ascendingNode: Vector3,
  xAxis: Vector3 // X-Axis of the reference frame.
) {
  const ascNodeMag = ascendingNode.length();
  const longitudeOfAscendingNode = radToDeg(
    Math.acos(ascendingNode.dot(xAxis) / ascNodeMag)
  );

  if (ascNodeMag < 0) {
    return 360 - longitudeOfAscendingNode;
  }
  return longitudeOfAscendingNode;
}
