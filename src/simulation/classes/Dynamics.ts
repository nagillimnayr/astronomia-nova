import { Object3D, Quaternion, Vector3 } from 'three';
import PointMass from '../interfaces/PointMass';
import Vec3 from '../types/Vec3';
import { selectState } from '../state/SelectState';
import { simState } from '../state/SimState';
import { camState } from '../state/CamState';

class KinematicBody extends Object3D {
  private _velocity: Vector3;
  private _acceleration: Vector3;

  constructor(initialPosition?: Vec3, initialVelocity?: Vec3) {
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
  set velocity(newVelocity: Vec3) {
    this._velocity.set(...newVelocity);
  }

  // acceleration
  set acceleration(newAcceleration: Vec3) {
    this._acceleration.set(...newAcceleration);
  }
  get acceleration(): Vector3 {
    return this._acceleration;
  }

  // update
  private updatePosition(deltaTime: number) {
    // log position before and after update
    // if (selectState.selected && this.id === selectState.selected.id) {
    //   console.log('position pre-update:', this.position.toArray());
    //   console.log('matrix pre-update:', this.matrix.toArray());

    //   this.position.addScaledVector(this.velocity, deltaTime);

    //   console.log('position post-update:', this.position.toArray());
    //   console.log('matrix post-update:', this.matrix.toArray());
    // } else {
    //   this.position.addScaledVector(this.velocity, deltaTime);
    // }
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

  constructor(mass?: number, initialPosition?: Vec3, initialVelocity?: Vec3) {
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
