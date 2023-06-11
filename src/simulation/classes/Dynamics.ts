import { Object3D, Vector3 } from "three";
import PointMass from "../interfaces/PointMass";

class KinematicBody extends Object3D {
  private _velocity: Vector3;
  private _acceleration: Vector3;

  constructor(initialPosition?: Vector3, initialVelocity?: Vector3) {
    super();
    if (initialPosition) {
      this.position.set(...initialPosition.toArray());
    }
    this._velocity = initialVelocity
      ? new Vector3(...initialVelocity.toArray())
      : new Vector3(0, 0, 0);
    this._acceleration = new Vector3(0, 0, 0);
  }

  // getters
  get velocity(): Vector3 {
    return this._velocity;
  }
  get acceleration(): Vector3 {
    return this._acceleration;
  }

  // setters
  set velocity(newVelocity: Vector3) {
    this._velocity.set(...newVelocity.toArray());
  }
  set acceleration(newAcceleration: Vector3) {
    this._acceleration.set(...newAcceleration.toArray());
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

  constructor(
    mass?: number,
    initialPosition?: Vector3,
    initialVelocity?: Vector3
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
      throw new Error("mass cannot be negative");
    }
  }
}

export { KinematicBody, DynamicBody };
