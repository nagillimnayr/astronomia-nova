import { type Object3D, Vector3, type Vector3Tuple } from 'three';

const _up = new Vector3();
const _objWorldPos = new Vector3();

/**
 * @description Returns the object's local y-axis unit vector in world
 *   coordinates.
 *
 *
 * @author Ryan Milligan
 * @date 12/08/2023
 *
 * @export
 * @param {Object3D} obj
 * @returns {*}  {Vector3Tuple}
 */
export function getLocalUpInWorldCoords(obj: Object3D): Vector3Tuple;
export function getLocalUpInWorldCoords(obj: Object3D, vec: Vector3): Vector3;
export function getLocalUpInWorldCoords(obj: Object3D, vec?: Vector3) {
  // Get the object's world coords.
  obj.getWorldPosition(_objWorldPos);
  _up.set(0, 1, 0); // Reset to y unit vector.

  // Get local y unit vector in world coords. (This will set _up as the
  // object's up vector relative to the world origin. Equivalent to adding the
  // local up vector to the object's world coords.)
  obj.localToWorld(_up);
  // To get the direction of the vector relative to the object, we can subtract
  // the object's world coords.
  _up.sub(_objWorldPos);
  // We now have the object's up vector in world coords.

  if (!vec) {
    return _up.toArray();
  } else {
    vec.copy(_up);
    return vec;
  }
}
