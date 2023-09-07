import PointMass from '@/interfaces/point-mass';
import { Object3D, Vector3, Vector3Tuple } from 'three';

/**
 * @description Base class for an object with mass, velocity, and acceleration.
 *
 * @author Ryan Milligan
 * @date Sep/07/2023
 * @class DynamicBody
 * @extends {Object3D}
 */
class DynamicBody extends Object3D implements PointMass {
  private _velocity: Vector3;
  private _acceleration: Vector3;
  private _mass: number;

  constructor(
    mass?: number,
    initialPosition?: Vector3Tuple,
    initialVelocity?: Vector3Tuple
  ) {
    super();

    if (initialPosition) {
      this.position.set(...initialPosition);
    }
    this._velocity = initialVelocity
      ? new Vector3(...initialVelocity)
      : new Vector3(0, 0, 0);
    this._acceleration = new Vector3(0, 0, 0);
    this._mass = mass ?? 0;
  }
  get velocity(): Vector3 {
    return this._velocity;
  }
  set velocity(newVelocity: Vector3Tuple) {
    this._velocity.set(...newVelocity);
  }

  get acceleration(): Vector3 {
    return this._acceleration;
  }
  set acceleration(newAcceleration: Vector3Tuple) {
    this._acceleration.set(...newAcceleration);
  }

  get mass(): number {
    return this._mass;
  }
  set mass(newMass: number) {
    if (newMass >= 0) {
      this._mass = newMass;
    } else {
      throw new Error('mass cannot be negative');
    }
  }

  private updatePosition(deltaTime: number) {
    this.position.addScaledVector(this.velocity, deltaTime);
  }

  private updateVelocity(deltaTime: number) {
    this.velocity.addScaledVector(this.acceleration, deltaTime);
  }

  update(deltaTime: number) {
    this.updateVelocity(deltaTime);
    this.updatePosition(deltaTime);
  }
}

export { DynamicBody };
