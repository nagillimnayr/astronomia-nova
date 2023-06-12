import { Object3D, Vector3 } from 'three';
import PointMass from '../interfaces/PointMass';

type vec3 = [number, number, number];

class KinematicBody extends Object3D {
  private _velocity: Vector3;
  private _acceleration: Vector3;

  constructor(initialPosition?: vec3, initialVelocity?: vec3) {
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
  set velocity(newVelocity: vec3) {
    this._velocity.set(...newVelocity);
  }

  // acceleration
  set acceleration(newAcceleration: vec3) {
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
    this.updateVelocity(deltaTime);
    this.updatePosition(deltaTime);
  }
}

class DynamicBody extends KinematicBody implements PointMass {
  private _mass: number;

  constructor(mass?: number, initialPosition?: vec3, initialVelocity?: vec3) {
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
