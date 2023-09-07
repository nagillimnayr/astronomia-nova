import {
  DEG_TO_RADS,
  PI,
  PI_OVER_THREE,
  PI_OVER_TWO,
  TWO_PI,
  Y_AXIS,
} from '@/constants/constants';
import { normalizeAngle } from '@/helpers/rotation-utils';
import { getLocalUpInWorldCoords } from '@/helpers/vector-utils';
import { Object3D, type PerspectiveCamera, Spherical, Vector3 } from 'three';
import { clamp } from 'three/src/math/MathUtils';
import { smoothCritDamp } from './smoothing';

const EPSILON = 1e-3;
// const EPSILON = 1e-14;

const MIN_RADIUS_BOUND = Number.EPSILON;
const MAX_RADIUS_BOUND = Infinity;

const MIN_POLAR_ANGLE_BOUND = EPSILON;
const MAX_POLAR_ANGLE_BOUND = PI - EPSILON;

const MIN_AZIMUTHAL_ANGLE_BOUND = 0;
const MAX_AZIMUTHAL_ANGLE_BOUND = TWO_PI;

const DEFAULT_RADIUS = 10;
const DEFAULT_AZIMUTH = 0;
const DEFAULT_POLAR = PI_OVER_THREE;

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();
const _v5 = new Vector3();

function approxZero(num: number, epsilon = EPSILON) {
  return Math.abs(num) <= epsilon;
}

export class CameraController extends Object3D {
  private _camera: PerspectiveCamera | null = null;
  private _domElement: HTMLElement | null = null;

  private _spherical = new Spherical();
  private _sphericalTarget = new Spherical();

  private _pivotPoint = new Object3D();
  private _attachPoint = new Object3D();

  private _radiusVelocity = 0;
  private _minRadius = MIN_RADIUS_BOUND;
  private _maxRadius = MAX_RADIUS_BOUND;
  private _zoomSpeed = 2;
  private _zoomFactor = 1e-1;

  private _polarAngleVelocity = 0;
  private _minPolarAngle = MIN_POLAR_ANGLE_BOUND;
  private _maxPolarAngle = MAX_POLAR_ANGLE_BOUND;

  private _azimuthalAngleVelocity = 0;
  private _minAzimuthalAngle = -Infinity;
  private _maxAzimuthalAngle = Infinity;

  private _rotationSpeed = 0.75;
  private _smoothTime = 0.3;

  private _locked = false;

  private _isMoving = false;

  update(deltaTime: number) {
    this._isMoving = false;

    this.updateRadius(deltaTime);
    this.updatePolarAngle(deltaTime);
    this.updateAzimuthalAngle(deltaTime);
    const pivotPoint = this._pivotPoint;
    const attachPoint = this._attachPoint;
    pivotPoint.rotation.set(0, 0, 0); // Reset rotations.
    attachPoint.position.set(0, 0, this._spherical.radius); // Set position of
    // camera.
    this._camera?.position.set(0, 0, 0);

    const azimuthalAngle = this._spherical.theta;
    const polarAngle = this._spherical.phi;

    // Rotations are intrinsic, so the order matters. Rotation around local
    // y-axis must be done first in order to preserve the local up-vector.
    pivotPoint.rotateY(azimuthalAngle); // Rotate around local y-axis.
    pivotPoint.rotateX(-(PI_OVER_TWO - polarAngle)); // Rotate around local
    // x-axis.

    this._camera?.updateProjectionMatrix();
  }

  private updateAzimuthalAngle(deltaTime: number) {
    this._normalizeAzimuthalAngle();
    const azimuthalAngle = this._spherical.theta;
    const azimuthalAngleTarget = this._sphericalTarget.theta;
    if (approxZero(azimuthalAngleTarget - azimuthalAngle)) return;

    this._isMoving = true;

    const [newValue, newVelocity] = smoothCritDamp(
      azimuthalAngle,
      azimuthalAngleTarget,
      this._azimuthalAngleVelocity,
      this._smoothTime,
      deltaTime
    );
    this._azimuthalAngleVelocity = newVelocity;

    this.setAzimuthalAngle(newValue);
  }

  private updatePolarAngle(deltaTime: number) {
    const polarAngle = this._spherical.phi;
    const polarAngleTarget = this._sphericalTarget.phi;
    if (approxZero(polarAngleTarget - polarAngle)) return;

    this._isMoving = true;

    const [newValue, newVelocity] = smoothCritDamp(
      polarAngle,
      polarAngleTarget,
      this._polarAngleVelocity,
      this._smoothTime,
      deltaTime
    );
    this._polarAngleVelocity = newVelocity;
    this.setPolarAngle(newValue);
  }

  private updateRadius(deltaTime: number) {
    const radius = this._spherical.radius;
    const radiusTarget = this._sphericalTarget.radius;
    if (approxZero(radiusTarget - radius)) return;

    this._isMoving = true;

    const [newValue, newVelocity] = smoothCritDamp(
      radius,
      radiusTarget,
      this._radiusVelocity,
      this._smoothTime,
      deltaTime
    );
    this._radiusVelocity = newVelocity;
    this._setRadius(newValue);
    this._spherical.radius = newValue;
  }

  // Set radius without clamping to min/max. This allows setting the min/max
  // distance to trigger a transition to the clamped value.
  private _setRadius(radius: number) {
    this._spherical.radius = Math.max(radius, 0); // We still don't want it to
    // be negative though.
  }

  setRadius(radius: number) {
    // Adjust to be within min/max range.
    this._spherical.radius = clamp(radius, this._minRadius, this._maxRadius);
  }

  setRadiusTarget(radiusTarget: number) {
    this._sphericalTarget.radius = clamp(
      radiusTarget,
      this._minRadius,
      this._maxRadius
    );
  }

  // Alias for setRadiusTarget.
  setTargetRadius(radiusTarget: number) {
    this.setRadiusTarget(radiusTarget);
  }

  addRadialZoom(zoom: number) {
    if (approxZero(zoom)) return;
    const radius = this._spherical.radius;
    const deltaZoom = zoom * this._zoomSpeed * (radius * this._zoomFactor);

    this.setTargetRadius(this._sphericalTarget.radius + deltaZoom);
  }

  get radius() {
    // return this._radius;
    return this._spherical.radius;
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
    this._spherical.phi = adjustedAngle;
  }

  setPolarAngleTarget(polarAngleTarget: number) {
    this._sphericalTarget.phi = clamp(
      polarAngleTarget,
      this._minPolarAngle,
      this._maxPolarAngle
    );
  }

  addPolarRotation(polarRotation: number) {
    // if (approxZero(polarRotation)) return;
    this.setPolarAngleTarget(
      this._sphericalTarget.phi +
        polarRotation * this._rotationSpeed * DEG_TO_RADS
    );
  }

  setAzimuthalAngle(azimuthalAngle: number) {
    const adjustedAngle = clamp(
      azimuthalAngle,
      this._minAzimuthalAngle,
      this._maxAzimuthalAngle
    );
    this._spherical.theta = adjustedAngle;
  }

  setAzimuthalAngleTarget(polarAngleTarget: number) {
    this._sphericalTarget.theta = clamp(
      polarAngleTarget,
      this._minAzimuthalAngle,
      this._maxAzimuthalAngle
    );
  }

  private _normalizeAzimuthalAngle() {
    const deltaTheta = this._sphericalTarget.theta - this._spherical.theta;
    // Adjust angles to be within range [0, TWO_PI)
    this._sphericalTarget.theta = normalizeAngle(this._sphericalTarget.theta);

    // Maintain the difference between the two values.
    this._spherical.theta = this._sphericalTarget.theta - deltaTheta;
  }

  addAzimuthalRotation(azimuthalRotation: number) {
    // if (approxZero(azimuthalRotation)) return;
    this._sphericalTarget.theta +=
      azimuthalRotation * this._rotationSpeed * DEG_TO_RADS;
  }

  addRotation(azimuthalRotation: number, polarRotation: number) {
    this.addAzimuthalRotation(azimuthalRotation);
    this.addPolarRotation(polarRotation);
  }

  get azimuthalAngle() {
    return this._spherical.theta;
  }

  get azimuthalAngleTarget() {
    return this._sphericalTarget.theta;
  }

  get polarAngle() {
    return this._spherical.phi;
  }

  get polarAngleTarget() {
    return this._sphericalTarget.phi;
  }

  setCamera(camera: PerspectiveCamera) {
    if (camera === this._camera) {
      return;
    }
    // console.log('Setting camera in camera controller!', camera);
    this._camera = camera;
    // const parent = camera.parent;
    this.attachToController(camera);
    // if (parent && parent !== this._attachPoint) {
    //   parent.add(this);
    // }
  }

  set camera(camera: PerspectiveCamera) {
    this.setCamera(camera);
  }

  get camera() {
    return this._camera!;
  }

  getCameraWorldPosition(vec: Vector3) {
    return this._attachPoint.getWorldPosition(vec);
  }

  getCameraWorldDirection(vec: Vector3) {
    return this._attachPoint.getWorldDirection(vec).multiplyScalar(-1);
  }

  getCameraWorldUp(vec: Vector3) {
    vec.set(...getLocalUpInWorldCoords(this._attachPoint));
    return vec;
  }

  private _clampRadiusTarget() {
    this._sphericalTarget.radius = clamp(
      this._sphericalTarget.radius,
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

    this._clampRadiusTarget();
    // this._clampRadius();
  }

  get minDistance() {
    return this._minRadius;
  }

  set minDistance(minDistance: number) {
    // console.log('set minDistance');
    this.setMinRadius(minDistance);
  }

  get maxRadius() {
    return this._maxRadius;
  }

  set maxRadius(maxRadius: number) {
    // console.log('set minDistance');
    this.setMaxRadius(maxRadius);
  }

  setMaxRadius(maxRadius: number) {
    this._maxRadius = clamp(maxRadius, this._minRadius, MAX_RADIUS_BOUND);

    this._clampRadiusTarget();
    // this._clampRadius();
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
    this.setPolarAngle(this._spherical.phi); // Clamp polar angle.
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
    this.setPolarAngle(this._spherical.phi); // Clamp polar angle.
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
    this.setAzimuthalAngle(this._spherical.theta); // Clamp azimuthal angle.
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
    this.setAzimuthalAngle(this._spherical.theta); // Clamp azimuthal angle.
  }

  getWorldUp() {
    return getLocalUpInWorldCoords(this);
  }

  // Adjust the orientation of the controller so that the local up vector is
  // parallel with the world y-axis.
  applyWorldUp() {
    // Get the world position of the point 1 unit from the object in the z-axis.
    this.getWorldPosition(_v1);
    _v2.set(0, 0, 1);
    _v3.addVectors(_v1, _v2);

    // Look down the z-axis.
    this.up.copy(Y_AXIS);
    this.lookAt(_v3);
  }

  attachControllerTo(obj: Object3D) {
    obj.add(this);
  }

  // Attach the controller to the object but maintain its current position and
  // orientation.
  attachToWithoutMoving(obj: Object3D) {
    // Get world position of camera.
    this.camera.getWorldPosition(_v1);
    // Get world position of object.
    obj.getWorldPosition(_v2);
    // Get vector from object to camera.
    _v3.subVectors(_v1, _v2);
    // Get the spherical coordinates.
    this._spherical.setFromVector3(_v3);
    this._sphericalTarget.theta = this._spherical.theta;
    this._sphericalTarget.phi = this._spherical.phi;

    // Set radius.
    const radius = _v3.length();
    this._setRadius(radius);
    this.setTargetRadius(radius);

    // this._pivotPoint.getWorldPosition(_v1);

    // Attach to the object.
    obj.add(this);

    // Maintain look direction.
    // this.applyWorldUp();
    // this._attachPoint.up = this.up;
    // this._camera.up = this.up;
    // this._attachPoint.rotateY(PI);
    // this._camera?.lookAt(_v1);
  }

  attachToController(obj: Object3D) {
    this._attachPoint.add(obj);
  }

  get locked() {
    return this._locked;
  }

  lock() {
    this._locked = true;
    this.disconnectEventListeners();
  }

  unlock() {
    this._locked = false;
    this.connectEventListeners();
  }

  get isMoving() {
    return this._isMoving;
  }

  private _onPointerDown(event: PointerEvent) {
    const button = event.button;
    if (!this._domElement) return;
    event.preventDefault();

    this._domElement.setPointerCapture(event.pointerId);

    switch (button) {
      case 0: {
        this._domElement.addEventListener(
          'pointermove',
          this.onPointerMoveLeft
        );
        break;
      }
      case 1: {
        this._domElement.addEventListener(
          'pointermove',
          this.onPointerMoveMiddle
        );
        break;
      }
      case 2: {
        this._domElement.addEventListener(
          'pointermove',
          this.onPointerMoveRight
        );
        break;
      }
    }
  }

  // Bind instance's 'this' to the function so it can be passed as a callback.
  onPointerDown = this._onPointerDown.bind(this);

  private _onPointerUp(event: PointerEvent) {
    const button = event.button;
    if (!this._domElement) return;
    event.preventDefault();

    switch (button) {
      case 0: {
        this._domElement.removeEventListener(
          'pointermove',
          this.onPointerMoveLeft
        );
        break;
      }
      case 1: {
        this._domElement.removeEventListener(
          'pointermove',
          this.onPointerMoveMiddle
        );
        break;
      }
      case 2: {
        this._domElement.removeEventListener(
          'pointermove',
          this.onPointerMoveRight
        );
        event;
        event.stopPropagation();
        break;
      }
    }
  }

  // Bind instance's 'this' to the function so it can be passed as a callback.
  onPointerUp = this._onPointerUp.bind(this);

  private _onPointerMoveLeft(event: PointerEvent) {
    if (event.buttons % 2 === 0) {
      this._domElement?.removeEventListener(
        'pointermove',
        this.onPointerMoveLeft
      );
      return;
    }

    event.preventDefault();
    const deltaX = -event.movementX;
    const deltaY = -event.movementY;

    this.addRotation(deltaX, deltaY);
  }

  // Bind instance's 'this' to the function so it can be passed as a callback.
  onPointerMoveLeft = this._onPointerMoveLeft.bind(this);

  private _onPointerMoveMiddle(event: PointerEvent) {
    event.preventDefault();
    const deltaY = event.movementY / 50;
    this.addRadialZoom(deltaY);
  }

  // Bind instance's 'this' to the function so it can be passed as a callback.
  onPointerMoveMiddle = this._onPointerMoveMiddle.bind(this);

  private _onPointerMoveRight(event: PointerEvent) {
    event.preventDefault();
    const deltaY = event.movementY / 50;
    this.addRadialZoom(deltaY);
  }

  // Bind instance's 'this' to the function so it can be passed as a callback.
  onPointerMoveRight = this._onPointerMoveRight.bind(this);

  private _onPointerWheel(event: WheelEvent) {
    event.preventDefault();
    // deltaY will be between -100 and 100.
    const zoom = event.deltaY / 100;
    this.addRadialZoom(zoom);
  }

  // Bind instance's 'this' to the function so it can be passed as a callback.
  onPointerWheel = this._onPointerWheel.bind(this);

  onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // private onGamepadConnected: (event: GamepadEvent)=>void = (event) => {
  //   const gamepad = event.gamepad;

  // }

  connectEventListeners() {
    if (!this._domElement) return;
    this._domElement.addEventListener('pointerdown', this.onPointerDown);
    this._domElement.addEventListener('pointerup', this.onPointerUp);
    this._domElement.addEventListener('wheel', this.onPointerWheel);
    this._domElement.addEventListener('contextmenu', this.onContextMenu);

    // if (window !== undefined) {
    //     window.addEventListener('gamepadconnected', )
    //   }
  }

  disconnectEventListeners() {
    if (!this._domElement) return;
    this._domElement.removeEventListener('pointerdown', this.onPointerDown);
    this._domElement.removeEventListener('pointerup', this.onPointerUp);
    this._domElement.removeEventListener('wheel', this.onPointerWheel);
    this._domElement.removeEventListener('contextmenu', this.onContextMenu);

    this._domElement.removeEventListener('pointermove', this.onPointerMoveLeft);

    this._domElement.removeEventListener(
      'pointermove',
      this.onPointerMoveMiddle
    );

    this._domElement.removeEventListener(
      'pointermove',
      this.onPointerMoveRight
    );
  }

  get domElement(): HTMLElement | null {
    return this._domElement;
  }

  set domElement(domElement: HTMLElement) {
    this.setDomElement(domElement);
  }

  setDomElement(domElement: HTMLElement) {
    // console.log('setting dom element');
    if (this._domElement) {
      // Disconnect event listeners before setting new dom element.
      this.disconnectEventListeners();
    }
    this._domElement = domElement;
    // Connect event listeners.
    this.connectEventListeners();
  }

  constructor(
    camera?: PerspectiveCamera,
    radius?: number,
    azimuthalAngle?: number,
    polarAngle?: number
  ) {
    super();
    this.add(this._pivotPoint);
    this._pivotPoint.add(this._attachPoint);
    this.name = 'camera-controller';
    this._pivotPoint.name = 'camera-pivot-point';
    this._attachPoint.name = 'camera-attach-point';

    if (camera) {
      this._camera = camera;
      const parent = camera.parent;
      this._attachPoint.add(camera);
      if (parent) {
        parent.add(this);
      }
    }

    radius = radius ?? DEFAULT_RADIUS;
    this.setRadiusTarget(radius);
    this.setRadius(radius);

    azimuthalAngle = azimuthalAngle ?? DEFAULT_AZIMUTH;
    this.setAzimuthalAngleTarget(azimuthalAngle);
    this.setAzimuthalAngle(azimuthalAngle);

    polarAngle = polarAngle ?? DEFAULT_POLAR;
    this.setPolarAngleTarget(polarAngle);
    this.setPolarAngle(polarAngle);
  }

  /*  End of CameraController class. */
}
