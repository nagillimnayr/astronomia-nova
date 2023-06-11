import { Vector3 } from 'three';

/**
 * @description
 * @author Ryan Milligan
 * @date 28/05/2023
 * @interface PointMass
 */
export default interface PointMass {
  mass: number;
  position: Vector3;
}
