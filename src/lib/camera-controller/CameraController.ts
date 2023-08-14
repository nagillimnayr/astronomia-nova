import {
  ArrowHelper,
  Group,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from 'three';
import { damp, degToRad, clamp } from 'three/src/math/MathUtils';
import {
  TWO_PI,
  PI_OVER_TWO,
  PI,
  DEG_TO_RADS,
  PI_OVER_THREE,
  METER,
} from '@/simulation/utils/constants';
import { smoothCritDamp } from './smoothing';
import { getLocalUpInWorldCoords } from '@/simulation/utils/vector-utils';

const X_AXIS: Readonly<Vector3> = new Vector3(1, 0, 0);
const Y_AXIS: Readonly<Vector3> = new Vector3(0, 1, 0);

const EPSILON = 1e-5;

const MIN_RADIUS_BOUND = Number.EPSILON;
const MAX_RADIUS_BOUND = Infinity;

const MIN_POLAR_ANGLE_BOUND = EPSILON;
const MAX_POLAR_ANGLE_BOUND = PI - EPSILON;

const MIN_AZIMUTHAL_ANGLE_BOUND = 0;
const MAX_AZIMUTHAL_ANGLE_BOUND = TWO_PI;

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

function approxZero(num: number, epsilon = EPSILON) {
  return Math.abs(num) <= epsilon;
}

export class CameraController extends Object3D {
  private _camera: PerspectiveCamera | null = null;
  private _domElement: HTMLElement | null = null;

  private _worldUpQuaternion = new Quaternion();
  private _cameraWorldDirection = new Vector3();

  private _pivot = new Object3D();

  private _radius = 1e3;
  private _radiusTarget = this._radius;
  private _radiusVelocity = 0;
  private _minRadius = MIN_RADIUS_BOUND;
  private _maxRadius = 1e10;
  private _zoomSpeed = 2;
  private _zoomFactor = 1e-1;

  private _polarAngle = PI_OVER_THREE;
  private _polarAngleTarget = this._polarAngle;
  private _polarAngleVelocity = 0;
  private _minPolarAngle = MIN_POLAR_ANGLE_BOUND;
  private _maxPolarAngle = MAX_POLAR_ANGLE_BOUND;

  private _azimuthalAngle = 0;
  private _azimuthalAngleTarget = this._azimuthalAngle;
  private _azimuthalAngleVelocity = 0;
  private _minAzimuthalAngle = -Infinity;
  private _maxAzimuthalAngle = Infinity;

  private _rotationSpeed = 0.75;
  private _smoothTime = 0.25;

  private _mouseDownLeft = false;
  private _mouseDownRight = false;
  private _mouseDownMiddle = false;

  constructor(camera?: PerspectiveCamera) {
    super();
    this.add(this._pivot);
    this.name = 'camera-controller';
    this._pivot.name = 'camera-pivot';

    if (camera) {
      this._camera = camera;
      const parent = camera.parent;
      this._pivot.add(camera);
      if (parent) {
        parent.add(this);
      }
    }
  }

  update(deltaTime: number) {
    // if (!this._needsUpdate && !force) return;
    this.updateRadius(deltaTime);
    this.updatePolarAngle(deltaTime);
    this.updateAzimuthalAngle(deltaTime);
    const pivot = this._pivot;
    pivot.rotation.set(0, 0, 0); // Reset rotations.
    this._camera?.position.set(0, 0, this._radius); // Set position of camera.

    // Rotations are intrinsic, so the order matters. Rotation around local y-axis must be done first in order to preserve the local up-vector.
    pivot.rotateY(this._azimuthalAngle); // Rotate around local y-axis.
    pivot.rotateX(-(PI_OVER_TWO - this._polarAngle)); // Rotate around local x-axis.

    this._camera?.updateProjectionMatrix();
  }

  private updateAzimuthalAngle(deltaTime: number) {
    if (approxZero(this._azimuthalAngleTarget - this._azimuthalAngle)) return;

    const [newValue, newVelocity] = smoothCritDamp(
      this._azimuthalAngle,
      this._azimuthalAngleTarget,
      this._azimuthalAngleVelocity,
      this._smoothTime,
      deltaTime
    );
    this._azimuthalAngleVelocity = newVelocity;
    if (approxZero(this._azimuthalAngleTarget - newValue)) {
      this.setAzimuthalAngle(this._azimuthalAngleTarget);
      this._normalizeAzimuthalAngle();
    } else {
      this.setAzimuthalAngle(newValue);
    }
  }
  private updatePolarAngle(deltaTime: number) {
    if (approxZero(this._polarAngleTarget - this._polarAngle)) return;

    const [newValue, newVelocity] = smoothCritDamp(
      this._polarAngle,
      this._polarAngleTarget,
      this._polarAngleVelocity,
      this._smoothTime,
      deltaTime
    );
    this._polarAngleVelocity = newVelocity;
    approxZero(this._polarAngleTarget - newValue)
      ? this.setPolarAngle(this._polarAngleTarget)
      : this.setPolarAngle(newValue);
  }
  private updateRadius(deltaTime: number) {
    if (approxZero(this._radiusTarget - this._radius)) return;

    const [newValue, newVelocity] = smoothCritDamp(
      this._radius,
      this._radiusTarget,
      this._radiusVelocity,
      this._smoothTime,
      deltaTime
    );
    this._radiusVelocity = newVelocity;

    approxZero(this._radiusTarget - newValue)
      ? this.setRadius(this._radiusTarget)
      : this.setRadius(newValue);
  }

  setRadius(radius: number) {
    // Adjust to be within min/max range.
    this._radius = clamp(radius, this._minRadius, this._maxRadius);
  }
  setTargetRadius(radiusTarget: number) {
    this._radiusTarget = clamp(radiusTarget, this._minRadius, this._maxRadius);
  }
  addRadialZoom(zoom: number) {
    if (approxZero(zoom)) return;

    const deltaZoom =
      zoom * this._zoomSpeed * (this._radius * this._zoomFactor);

    this._radiusTarget += deltaZoom;
    this._radiusTarget = clamp(
      this._radiusTarget,
      this._minRadius,
      this._maxRadius
    );
  }

  get radius() {
    return this._radius;
  }
  set radius(radius) {
    this.setRadius(radius);
  }

  setPolarAngle(polarAngle: number) {
    // Adjust angle to be within min/max range.
    const adjustedAngle = clamp(
      polarAngle,
      this._minPolarAngle,
      this._maxPolarAngle
    );
    this._polarAngle = adjustedAngle;
  }
  addPolarRotation(polarRotation: number) {
    // if (approxZero(polarRotation)) return;
    this._polarAngleTarget += polarRotation * this._rotationSpeed * DEG_TO_RADS;
    this._polarAngleTarget = clamp(
      this._polarAngleTarget,
      this._minPolarAngle,
      this._maxPolarAngle
    );
  }

  setAzimuthalAngle(azimuthalAngle: number) {
    this._azimuthalAngle = clamp(
      azimuthalAngle,
      this._minAzimuthalAngle,
      this._maxAzimuthalAngle
    );
  }
  private _normalizeAzimuthalAngle() {
    // Adjust angle to be within range [0, TWO_PI]
    let adjustedAngle = this._azimuthalAngle;
    while (adjustedAngle > TWO_PI) {
      adjustedAngle -= TWO_PI;
    }
    while (adjustedAngle < 0) {
      adjustedAngle += TWO_PI;
    }
    adjustedAngle = clamp(
      adjustedAngle,
      this._minAzimuthalAngle,
      this._maxAzimuthalAngle
    );
    this._azimuthalAngle = adjustedAngle;
    this._azimuthalAngleTarget = adjustedAngle;
  }

  addAzimuthalRotation(azimuthalRotation: number) {
    // if (approxZero(azimuthalRotation)) return;
    this._azimuthalAngleTarget +=
      azimuthalRotation * this._rotationSpeed * DEG_TO_RADS;
  }

  addRotation(azimuthalRotation: number, polarRotation: number) {
    this.addAzimuthalRotation(azimuthalRotation);
    this.addPolarRotation(polarRotation);
  }

  setCamera(camera: PerspectiveCamera) {
    this._camera = camera;
    const parent = camera.parent;
    this._pivot.add(camera);
    if (parent && parent !== this._pivot) {
      parent.add(this);
    }
  }
  set camera(camera: PerspectiveCamera) {
    this.setCamera(camera);
  }
  get camera() {
    return this._camera!;
  }

  private _clampRadiusTarget() {
    this._radiusTarget = clamp(
      this._radiusTarget,
      this._minRadius,
      this._maxRadius
    );
  }
  get minRadius() {
    return this._minRadius;
  }
  set minRadius(minRadius: number) {
    this.setMinRadius(minRadius);
  }
  setMinRadius(minRadius: number) {
    this._minRadius = clamp(minRadius, MIN_RADIUS_BOUND, this._maxRadius);
    // if (this._radius < this._minRadius) {
    //   this._radiusTarget = this._minRadius;
    // }
    this._clampRadiusTarget();
    // this.setRadius(this._radius); // Clamp radius.
    // this._radiusTarget = this._radius;
  }
  get minDistance() {
    return this._minRadius;
  }
  set minDistance(minDistance: number) {
    this.setMinRadius(minDistance);
  }

  get maxRadius() {
    return this._maxRadius;
  }
  set maxRadius(maxRadius: number) {
    this.setMaxRadius(maxRadius);
  }

  setMaxRadius(maxRadius: number) {
    this._maxRadius = clamp(maxRadius, this._minRadius, MAX_RADIUS_BOUND);
    // this.setRadius(this._radius); // Clamp radius.

    this._clampRadiusTarget();
  }
  get maxDistance() {
    return this._maxRadius;
  }
  set maxDistance(maxDistance: number) {
    this.setMaxRadius(maxDistance);
  }

  get minPolarAngle() {
    return this._minPolarAngle;
  }
  set minPolarAngle(minPolarAngle: number) {
    this.setMinPolarAngle(this.minPolarAngle);
  }
  setMinPolarAngle(minPolarAngle: number) {
    this._minPolarAngle = clamp(
      minPolarAngle,
      MIN_POLAR_ANGLE_BOUND,
      this._maxPolarAngle
    );
    this.setPolarAngle(this._polarAngle); // Clamp polar angle.
  }
  get maxPolarAngle() {
    return this._maxPolarAngle;
  }
  set maxPolarAngle(maxPolarAngle: number) {
    this.setMaxPolarAngle(maxPolarAngle);
  }
  setMaxPolarAngle(maxPolarAngle: number) {
    this._maxPolarAngle = clamp(
      maxPolarAngle,
      this._minPolarAngle,
      MAX_POLAR_ANGLE_BOUND
    );
    this.setPolarAngle(this._polarAngle); // Clamp polar angle.
  }

  get minAzimuthalAngle() {
    return this._minAzimuthalAngle;
  }
  set minAzimuthalAngle(minAzimuthalAngle: number) {
    this.setMinAzimuthalAngle(minAzimuthalAngle);
  }
  setMinAzimuthalAngle(minAzimuthalAngle: number) {
    this._minAzimuthalAngle = clamp(
      minAzimuthalAngle,
      -Infinity,
      this._maxAzimuthalAngle
    );
    this.setAzimuthalAngle(this._azimuthalAngle); // Clamp azimuthal angle.
  }
  get maxAzimuthalAngle() {
    return this._maxAzimuthalAngle;
  }
  set maxAzimuthalAngle(maxAzimuthalAngle: number) {
    this.setMaxAzimuthalAngle(maxAzimuthalAngle);
  }
  setMaxAzimuthalAngle(maxAzimuthalAngle: number) {
    this._maxAzimuthalAngle = clamp(
      maxAzimuthalAngle,
      this._minAzimuthalAngle,
      MAX_AZIMUTHAL_ANGLE_BOUND
    );
    this.setAzimuthalAngle(this._azimuthalAngle); // Clamp azimuthal angle.
  }

  private updateCameraWorldDirection() {
    if (!this._camera) return;
    this._camera.getWorldDirection(_v1);
    this._cameraWorldDirection.copy(_v1);
  }
  private updateWorldQuaternion() {
    this._worldUpQuaternion.setFromUnitVectors(this.up, Y_AXIS);
  }

  getWorldUp() {
    return getLocalUpInWorldCoords(this);
  }

  // Adjust the orientation of the controller so that the local up vector is parallel with the world y-axis.
  applyWorldUp() {
    // Get the world position of the point 1 unit from the object in the z-axis.
    this.getWorldPosition(_v1);
    _v2.set(0, 0, 1);
    _v3.addVectors(_v1, _v2);

    // Look down the z-axis.
    this.up.copy(Y_AXIS);
    this.lookAt(_v3);
  }

  applyUp(up: Vector3) {
    //
  }

  attachTo(obj: Object3D) {
    obj.add(this);
  }

  private _onMouseDown(event: MouseEvent) {
    const button = event.button;
    if (!this._domElement) return;
    event.preventDefault();

    switch (button) {
      case 0: {
        if (
          this._mouseDownLeft ||
          this._mouseDownMiddle ||
          this._mouseDownRight
        ) {
          return;
        }
        this._mouseDownLeft = true;
        this._domElement.addEventListener('mousemove', this.onMouseMoveLeft);
        break;
      }
      case 1: {
        if (
          this._mouseDownLeft ||
          this._mouseDownMiddle ||
          this._mouseDownRight
        ) {
          return;
        }
        this._mouseDownMiddle = true;
        this._domElement.addEventListener('mousemove', this.onMouseMoveMiddle);
        break;
      }
      case 2: {
        if (
          this._mouseDownLeft ||
          this._mouseDownMiddle ||
          this._mouseDownRight
        ) {
          return;
        }
        this._mouseDownRight = true;
        this._domElement.addEventListener('mousemove', this.onMouseMoveRight);
        break;
      }
    }
  }
  onMouseDown = this._onMouseDown.bind(this);

  private _onMouseUp(event: MouseEvent) {
    const button = event.button;
    if (!this._domElement) return;
    event.preventDefault();

    switch (button) {
      case 0: {
        this._mouseDownLeft = false;
        this._domElement.removeEventListener('mousemove', this.onMouseMoveLeft);
        break;
      }
      case 1: {
        this._mouseDownMiddle = false;
        this._domElement.removeEventListener(
          'mousemove',
          this.onMouseMoveMiddle
        );
        break;
      }
      case 2: {
        this._mouseDownRight = false;
        this._domElement.removeEventListener(
          'mousemove',
          this.onMouseMoveRight
        );
        event;
        event.stopPropagation();
        break;
      }
    }
  }
  onMouseUp = this._onMouseUp.bind(this);

  private _onMouseMoveLeft(event: MouseEvent) {
    if (!this._mouseDownLeft) return;
    event.preventDefault();
    const deltaX = -event.movementX;
    const deltaY = -event.movementY;

    this.addRotation(deltaX, deltaY);
  }
  onMouseMoveLeft = this._onMouseMoveLeft.bind(this);

  private _onMouseMoveMiddle(event: MouseEvent) {
    if (!this._mouseDownMiddle) return;
    event.preventDefault();
    const deltaY = event.movementY / 50;
    this.addRadialZoom(deltaY);
  }
  onMouseMoveMiddle = this._onMouseMoveMiddle.bind(this);

  private _onMouseMoveRight(event: MouseEvent) {
    if (!this._mouseDownRight) return;
    event.preventDefault();
    const deltaY = event.movementY / 50;
    this.addRadialZoom(deltaY);
  }
  onMouseMoveRight = this._onMouseMoveRight.bind(this);

  private _onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    // deltaY will be between -100 and 100.
    const zoom = event.deltaY / 100;
    this.addRadialZoom(zoom);
  }
  onMouseWheel = this._onMouseWheel.bind(this);

  onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // private onGamepadConnected: (event: GamepadEvent)=>void = (event) => {
  //   const gamepad = event.gamepad;

  // }

  connectEventListeners() {
    if (!this._domElement) return;
    this._domElement.addEventListener('mousedown', this.onMouseDown);
    this._domElement.addEventListener('mouseup', this.onMouseUp);
    this._domElement.addEventListener('wheel', this.onMouseWheel);
    this._domElement.addEventListener('contextmenu', this.onContextMenu);

    // if (window !== undefined) {
    //     window.addEventListener('gamepadconnected', )
    //   }
  }
  disconnectEventListeners() {
    if (!this._domElement) return;
    this._domElement.removeEventListener('mousedown', this.onMouseDown);
    this._domElement.removeEventListener('mouseup', this.onMouseUp);
    this._domElement.removeEventListener('wheel', this.onMouseWheel);
    this._domElement.removeEventListener('contextmenu', this.onContextMenu);

    if (this._mouseDownLeft) {
      this._domElement.removeEventListener('mousemove', this.onMouseMoveLeft);
    }
    if (this._mouseDownMiddle) {
      this._domElement.removeEventListener('mousemove', this.onMouseMoveMiddle);
    }
    if (this._mouseDownRight) {
      this._domElement.removeEventListener('mousemove', this.onMouseMoveRight);
    }
  }

  get domElement(): HTMLElement | null {
    return this._domElement;
  }
  set domElement(domElement: HTMLElement) {
    this.setDomElement(domElement);
  }
  setDomElement(domElement: HTMLElement) {
    console.log('setting dom element');
    if (this._domElement) {
      // Disconnect event listeners before setting new dom element.
      this.disconnectEventListeners();
    }
    this._domElement = domElement;
    // Connect event listeners.
    this.connectEventListeners();
  }
  //
}
