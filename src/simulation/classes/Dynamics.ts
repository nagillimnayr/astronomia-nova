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
    this.position.addScaledVector(this.velocity, deltaTime);
    // const newPosition = this.position
    //   .clone()
    //   .addScaledVector(this.velocity, deltaTime);

    // set the objects translation component of its transformation matrix
    // this.matrix.setPosition(newPosition);
  }
  private updateVelocity(deltaTime: number) {
    this.velocity.addScaledVector(this.acceleration, deltaTime);
  }

  update(deltaTime: number) {
    if (selectState.selected && this.id === selectState.selected.id) {
      const matrixPos = new Vector3();
      const matrixRot = new Quaternion();
      const matrixScale = new Vector3();
      this.matrix.decompose(matrixPos, matrixRot, matrixScale);
      console.log('kepler-body-before-update', {
        updateIteration: simState.updateIteration,
        name: this.name,
        position: this.position,
        matrixPos: matrixPos,
        id: this.id,
      });
    }

    this.updateVelocity(deltaTime);

    const updatedPosition = this.position
      .clone()
      .addScaledVector(this.velocity, deltaTime);

    this.updatePosition(deltaTime);

    if (selectState.selected && this.id === selectState.selected.id) {
      this.updateMatrixWorld(true);
      const matrixPos = new Vector3();
      const matrixRot = new Quaternion();
      const matrixScale = new Vector3();
      this.matrix.decompose(matrixPos, matrixRot, matrixScale);
      console.log('kepler-body-after-update', {
        updateIteration: simState.updateIteration,
        name: this.name,
        position: this.position,
        updatedPosition: updatedPosition,
        matrixPos: matrixPos,
        id: this.id,
      });
    }
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
