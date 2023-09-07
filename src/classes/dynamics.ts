import { Object3D, Vector3, Vector3Tuple } from 'three';
import PointMass from '@/interfaces/point-mass';

const _v1 = new Vector3();
const _v2 = new Vector3();

class KinematicBody extends Object3D {
  private _velocity: Vector3;
  private _acceleration: Vector3;

  constructor(initialPosition?: Vector3Tuple, initialVelocity?: Vector3Tuple) {
    super();
    if (initialPosition) {
      this.position.set(...initialPosition);
    }
    this._velocity = initialVelocity
      ? new Vector3(...initialVelocity)
      : new Vector3(0, 0, 0);
    this._acceleration = new Vector3(0, 0, 0);
  }

  // velocity
  get velocity(): Vector3 {
    return this._velocity;
  }

  set velocity(newVelocity: Vector3Tuple) {
    this._velocity.set(...newVelocity);
  }

  // acceleration
  set acceleration(newAcceleration: Vector3Tuple) {
    this._acceleration.set(...newAcceleration);
  }

  get acceleration(): Vector3 {
    return this._acceleration;
  }

  // update
  private updatePosition(deltaTime: number) {
    this.position.addScaledVector(this.velocity, deltaTime);
  }

  private updateVelocity(deltaTime: number) {
    this.velocity.addScaledVector(this.acceleration, deltaTime);
  }

  update(deltaTime: number) {
    // update velocity
    this.updateVelocity(deltaTime);

    // update position
    this.updatePosition(deltaTime);
  }
}

class DynamicBody extends KinematicBody implements PointMass {
  private _mass: number;

  constructor(
    mass?: number,
    initialPosition?: Vector3Tuple,
    initialVelocity?: Vector3Tuple
  ) {
    super(initialPosition, initialVelocity);
    this._mass = mass ?? 0;
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
}

export { KinematicBody, DynamicBody };
