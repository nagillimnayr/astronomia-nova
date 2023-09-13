import { Object3D, Vector3, type Vector3Tuple } from 'three';

/**
 * Base class for an object with mass, velocity, and acceleration.
 *
 * @class DynamicBody
 * @extends {Object3D}
 *
 */
class DynamicBody extends Object3D {
  private _velocity: Vector3;
  private _acceleration: Vector3;
  private _mass: number;

  /**
   * Creates an instance of DynamicBody.
   * @param {number} [mass]
   * @param {Vector3Tuple} [initialPosition]
   * @param {Vector3Tuple} [initialVelocity]
   */
  constructor(
    mass: number = 0,
    initialPosition: Vector3Tuple = [0, 0, 0],
    initialVelocity: Vector3Tuple = [0, 0, 0]
  ) {
    super();

    if (initialPosition) {
      this.position.set(...initialPosition);
    }
    this._velocity = new Vector3(...initialVelocity);
    this._acceleration = new Vector3(0, 0, 0);
    this._mass = mass;
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
