import {
  DEG_TO_RADS,
  PI,
  PI_OVER_THREE,
  PI_OVER_TWO,
  TWO_PI,
  Y_AXIS,
  Z_AXIS,
} from '@/constants/constants';
import { normalizeAngle, normalizeAngle180 } from '@/helpers/rotation-utils';
import { getLocalUpInWorldCoords } from '@/helpers/vector-utils';
import {
  Object3D,
  type PerspectiveCamera,
  Spherical,
  Vector3,
  Euler,
  type Vector3Tuple,
  Quaternion,
  Matrix4,
  Scene,
} from 'three';
import { clamp, radToDeg } from 'three/src/math/MathUtils';
import { damp, dampAngle } from 'maath/easing';
import { gsap } from 'gsap';
import { Controller, SpringValue } from '@react-spring/three';
import { delay } from '@/helpers/utils';

const EPSILON = 1e-3;

const DAMP_EPS = 1e-2;

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

const _q1 = new Quaternion();
const _q2 = new Quaternion();
const _m1 = new Matrix4();

const _camPos = new Vector3();
const _camWorldPos = new Vector3();
const _camUp = new Vector3();
const _camDirection = new Vector3();
const _controllerPos = new Vector3();
const _lookPos = new Vector3();

function approxZero(num: number, epsilon = EPSILON) {
  return Math.abs(num) <= epsilon;
}

/**
 * @description Controller to manage the camera, handle inputs, and smooth the camera motions.
 * @author Ryan Milligan
 * @date Sep/09/2023
 * @export
 * @class CameraController
 * @extends {Object3D}
 */
export class CameraController extends Object3D {
  private _camera: PerspectiveCamera | null = null;
  private _domElement: HTMLElement | null = null;

  private _spherical = new Spherical();
  private _sphericalTarget = new Spherical();

  private _pivotPoint = new Object3D();
  private _offsetPoint = new Object3D();
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
  private _isAnimating = false;

  private _springConfigDefault = {
    mass: 1.0,
    friction: 100.0,
    // tension: 225.0,
    clamp: true,
    // restVelocity: 0.001,
  };

  private _camera_spring = new Controller({
    camRotation: [0, 0, 0],
    ctrlRotation: [0, 0, 0],
    radius: 0.0,
    phi: 0.0,
    theta: 0.0,
    roll: 0.0,
    config: this._springConfigDefault,
  });

  private _roll = 0;

  updateCameraPosition() {
    if (!this._camera) return;
    this._camera.position.set(0, 0, 0);
    this._offsetPoint.position.set(0, 0, this._spherical.radius); // Set the offset of the camera.
    this._pivotPoint.position.set(0, 0, 0);
    this._attachPoint.position.set(0, 0, 0);

    const yRot = this._spherical.theta;
    const xRot = -(PI_OVER_TWO - this._spherical.phi);
    const roll = this._roll;

    // this._rollPoint.rotation.set(0, 0, roll);
    this._pivotPoint.rotation.set(xRot, yRot, 0, 'YXZ');
    this.camera.rotation.z = -roll;

    this._camera.updateProjectionMatrix();
  }

  /**
   * @description Updates the camera. Should be called inside of the render loop each frame.
   * @author Ryan Milligan
   * @date Sep/09/2023
   * @param {number} deltaTime
   * @memberof CameraController
   */
  update(deltaTime: number) {
    // this._isMoving = false;
    if (this._isAnimating) {
      this._camera?.updateProjectionMatrix();
      return;
    }
    if (!this._isAnimating) {
      const radiusMoving = damp(
        this._spherical,
        'radius',
        this._sphericalTarget.radius,
        this._smoothTime,
        deltaTime
      );

      const azimuthMoving = damp(
        this._spherical,
        'theta',
        this._sphericalTarget.theta,
        this._smoothTime,
        deltaTime
      );

      const polarMoving = damp(
        this._spherical,
        'phi',
        this._sphericalTarget.phi,
        this._smoothTime,
        deltaTime
      );

      const isMoving = radiusMoving || azimuthMoving || polarMoving;
      if (this._isMoving && !isMoving) {
        this.dispatchEvent({ type: 'REST' });
      }
      this._isMoving = isMoving;
    }

    this.updateCameraPosition();
  }

  /**
   * Sets the radius without clamping to min/max. This allows setting the min/max distance to trigger a transition to the clamped value.
   * @param {number} radius
   * @private
   */
  private _setRadius(radius: number) {
    this._spherical.radius = Math.max(radius, 0); // Still don't want it to be negative though.
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

  /**
   * Alias for setRadiusTarget.
   * @param {number} radiusTarget
   */
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
    return this._spherical.radius;
  }

  set radius(radius) {
    this.setRadius(radius);
  }

  setPolarAngle(polarAngle: number) {
    // Adjust angle to be within min/max range.
    this._spherical.phi = clamp(
      polarAngle,
      this._minPolarAngle,
      this._maxPolarAngle
    );
  }

  setPolarAngleTarget(polarAngleTarget: number) {
    this._sphericalTarget.phi = clamp(
      polarAngleTarget,
      this._minPolarAngle,
      this._maxPolarAngle
    );
  }

  addPolarRotation(polarRotation: number) {
    if (this._locked) return;
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

  normalizeAzimuthalAngle() {
    const deltaTheta = this._sphericalTarget.theta - this._spherical.theta;
    // Adjust angles to be within range [0, TWO_PI)
    this._sphericalTarget.theta = normalizeAngle(this._sphericalTarget.theta);

    // Maintain the difference between the two values.
    this._spherical.theta = this._sphericalTarget.theta - deltaTheta;
  }

  addAzimuthalRotation(azimuthalRotation: number) {
    if (this._locked) return;
    // if (approxZero(azimuthalRotation)) return;
    this._sphericalTarget.theta +=
      azimuthalRotation * this._rotationSpeed * DEG_TO_RADS;
  }

  addRotation(azimuthalRotation: number, polarRotation: number) {
    if (this._locked) return;
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
    this._camera = camera;
    this.attachToController(camera);
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
    return this.camera.getWorldDirection(vec);
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

  /**
   * @description Adjust the orientation of the controller so that the local up vector is parallel with the world y-axis.
   * @author Ryan Milligan
   * @date Sep/09/2023
   * @memberof CameraController
   */
  applyWorldUp() {
    // Get the world position of the point 1 unit from the object in the z-axis.
    this.getWorldPosition(_v1);
    _v3.addVectors(_v1, Z_AXIS);

    // Look down the local z-axis.
    this.up.copy(Y_AXIS);
    this.lookAt(_v3);
    this.rotation.set(0, 0, 0);
  }
  applyLocalUp() {
    this.getWorldPosition(_v1);
    _v3.addVectors(_v1, Z_AXIS);
    this.lookAt(_v3);
    // this.rotation.set(0, 0, 0);
  }

  /**
   * @description Attach the controller to the object.
   * @author Ryan Milligan
   * @date Sep/09/2023
   * @param {Object3D} obj
   * @memberof CameraController
   */
  attachControllerTo(obj: Object3D) {
    obj.add(this);
  }

  /**
   * @description Attach the controller to the object but maintain its current position.
   * @param {Object3D} obj
   * @memberof CameraController
   */
  async attachToWithoutMoving(obj: Object3D) {
    this.lock();
    this._isAnimating = true;

    /* Record camera world position before attachment. */
    this.camera.getWorldPosition(_camWorldPos);
    this._attachPoint.getWorldDirection(_camDirection);
    _lookPos.addVectors(_camWorldPos, _camDirection);
    _camPos.copy(_camWorldPos);
    this.getWorldPosition(_controllerPos);

    // this.camera.up.set(...getLocalUpInWorldCoords(this.camera));
    this._attachPoint.up.set(...getLocalUpInWorldCoords(this._attachPoint));

    // Attach to the object.
    obj.add(this);

    /* Convert previous camera world position to controller local space. */
    this.worldToLocal(_camPos);
    /* Get spherical coordinates from previous camera position. */
    this._spherical.setFromVector3(_camPos);
    this._spherical.makeSafe();

    this.resetTarget();
    this.updateCameraPosition();

    /* Look at previous focus position. */
    // this.camera.lookAt(_controllerPos);
    _v3.copy(_controllerPos).negate();
    this._attachPoint.lookAt(_lookPos);

    /* Get the angle between previous look direction and target look direction. */
    this.getWorldPosition(_v1);
    _v2.subVectors(_controllerPos, _camWorldPos);
    _v3.subVectors(_v1, _camWorldPos);
    const angle = Math.abs(_v2.angleTo(_v3));

    /* Use the angle to scale the duration, with a minimum duration of 1s. */
    const duration = Math.max(2.5 * angle, 1.0);

    /* Animate the camera's rotation to 0. */
    await gsap.to(this._attachPoint.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: duration,
      ease: 'power2.inOut',
    });

    this.unlock();
    this._isAnimating = false;
  }

  attachToController(obj: Object3D) {
    this._attachPoint.add(obj);
  }

  get locked() {
    return this._locked;
  }

  /**
   * @description Disable controls.
   * @memberof CameraController
   */
  lock() {
    this._locked = true;
    this.disconnectEventListeners();
  }

  /**
   * @description Enable controls.
   * @memberof CameraController
   */
  unlock() {
    this._locked = false;
    this.connectEventListeners();
  }

  get isMoving() {
    return this._isMoving;
  }

  get spherical() {
    return this._spherical;
  }

  get roll() {
    return this._roll;
  }

  /** Set the target coords to the current coords.  */
  resetTarget() {
    const { radius, phi, theta } = this._spherical;
    this._sphericalTarget.set(radius, phi, theta);
  }

  get isAnimating() {
    return this._isAnimating;
  }
  set isAnimating(isAnimating: boolean) {
    this._isAnimating = isAnimating;
  }

  resetRotation() {
    if (this._isAnimating) return;
    if (!this._camera) return;

    this._camera.getWorldPosition(_camPos);
    this.rotation.set(0, 0, 0);
    this.worldToLocal(_camPos);
    this.spherical.setFromVector3(_camPos);
    this.spherical.makeSafe();
    this.resetTarget();

    this.updateCameraPosition();
  }

  resetRoll() {
    this._roll = 0;
  }
  async animateResetRoll() {
    await this.animateRoll(0);
  }

  async animateRoll(angle: number, duration = 1) {
    if (this._isAnimating) return;
    if (!this._camera) return;
    this.lock();
    this._isAnimating = true;

    this._camera.getWorldPosition(_camWorldPos);

    await gsap.to(this.rotation, {
      x: -angle,
      duration: duration,
      onUpdate: () => {
        _camPos.copy(_camWorldPos);
        this.worldToLocal(_camPos);
        this._spherical.setFromVector3(_camPos);
        this._spherical.makeSafe();

        this.updateCameraPosition();
        this.resetTarget();
      },
    });

    this.unlock();
    this.isAnimating = false;
  }

  async animateRotation(targetRotation: Vector3Tuple) {
    if (this._isAnimating) return;
    this.lock();
    this._isAnimating = true;

    this.camera.getWorldPosition(_camWorldPos);
    this.rotation.y = 0;
    const [x0, y0, z0] = this.rotation.toArray();
    await this._camera_spring.start({
      from: { rotation: [x0, y0, z0] },
      to: { rotation: targetRotation },
      onChange: ({ value }) => {
        const rotation = value.rotation as Vector3Tuple;
        this.rotation.set(...rotation);

        _camPos.copy(_camWorldPos);
        this.worldToLocal(_camPos);
        this._spherical.setFromVector3(_camPos);
        this._spherical.makeSafe();
        this.resetTarget();

        this.updateCameraPosition();
      },
    });

    this.unlock();
    this._isAnimating = false;
  }

  async animateResetRotation() {
    if (this._isAnimating) return;
    if (!this._camera) return;
    this.lock();
    this._isAnimating = true;

    this._camera.getWorldPosition(_camWorldPos);

    /* Record start rotation. */
    const [x0, y0, z0] = this.rotation.toArray() as Vector3Tuple;

    await this._camera_spring.start({
      from: {
        rotation: [x0, y0, z0],
      },
      to: {
        rotation: [0, 0, 0],
      },
      onChange: ({ value }) => {
        const rotation = value.rotation as Vector3Tuple;
        this.rotation.set(...rotation);

        _camPos.copy(_camWorldPos);

        this.worldToLocal(_camPos);
        this._spherical.setFromVector3(_camPos);
        this._spherical.makeSafe();

        this.updateCameraPosition();
        this.resetTarget();
      },
    });

    this.unlock();
    this._isAnimating = false;
  }

  async animateTo(to: {
    radius?: number;
    phi?: number;
    theta?: number;
    duration?: number;
    ease?: string | gsap.EaseFunction | undefined;
  }) {
    if (this._isAnimating) return;

    this.lock();
    this._isAnimating = true;
    const { radius, phi, theta, ease } = to;
    const duration = to.duration ?? 1;
    if (
      typeof radius !== 'number' &&
      typeof phi !== 'number' &&
      typeof theta !== 'number'
    ) {
      this.unlock();
      this._isAnimating = false;
      return;
    }

    let targetTheta = theta ? normalizeAngle(theta) : this.azimuthalAngle;
    if (theta !== undefined) {
      const currentTheta = this.azimuthalAngle;

      /* Determine shortest path to target theta. */
      let diffTheta = 0;
      if (currentTheta <= targetTheta) {
        /**
         * e.g. currentTheta is 30 deg and targetTheta is 330 deg,
         * 330 - 30 = 300 deg
         * 300 - 360 = -60 deg
         * 30 + (-60) = -30 deg
         * -30 deg == 330 deg
         */
        diffTheta = targetTheta - currentTheta;

        /* If difference between angles is less than PI, then no need for adjustment. */
        targetTheta =
          diffTheta < PI ? targetTheta : currentTheta + (diffTheta - TWO_PI);
      } else {
        /**
         * e.g. currentTheta is 330 deg and targetTheta is 30 deg,
         * 330 - 30 = 300 deg
         * 360 - 300 = 60 deg
         * 330 + 60 deg = 390 deg
         * 390 deg = 30 deg
         */
        diffTheta = currentTheta - targetTheta;

        /* If difference between angles is less than PI, then no need for adjustment. */
        targetTheta =
          diffTheta < PI ? targetTheta : currentTheta + (TWO_PI - diffTheta);
      }
    }

    await gsap.to(this.spherical, {
      radius: radius ?? this.radius,
      phi: phi ?? this.polarAngle,
      theta: targetTheta ?? this.azimuthalAngle,
      duration: duration,
      ease: ease ?? 'power1.inOut',
      onUpdate: () => {
        this.updateCameraPosition();
        this.resetTarget();
      },
    });

    this.resetTarget();
    this.unlock();
    this._isAnimating = false;
  }

  async animateToSpring(to: { radius?: number; phi?: number; theta?: number }) {
    if (this._isAnimating) return;

    this.lock();
    this._isAnimating = true;
    const { radius, phi, theta } = to;
    if (
      typeof radius !== 'number' &&
      typeof phi !== 'number' &&
      typeof theta !== 'number'
    ) {
      this.unlock();
      this._isAnimating = false;
      return;
    }

    let targetTheta = theta ? normalizeAngle(theta) : this.azimuthalAngle;
    if (theta !== undefined) {
      const currentTheta = this.azimuthalAngle;

      /* Determine shortest path to target theta. */
      let diffTheta = 0;
      if (currentTheta <= targetTheta) {
        /**
         * e.g. currentTheta is 30 deg and targetTheta is 330 deg,
         * 330 - 30 = 300 deg
         * 300 - 360 = -60 deg
         * 30 + (-60) = -30 deg
         * -30 deg == 330 deg
         */
        diffTheta = targetTheta - currentTheta;

        /* If difference between angles is less than PI, then no need for adjustment. */
        targetTheta =
          diffTheta < PI ? targetTheta : currentTheta + (diffTheta - TWO_PI);
      } else {
        /**
         * e.g. currentTheta is 330 deg and targetTheta is 30 deg,
         * 330 - 30 = 300 deg
         * 360 - 300 = 60 deg
         * 330 + 60 deg = 390 deg
         * 390 deg = 30 deg
         */
        diffTheta = currentTheta - targetTheta;

        /* If difference between angles is less than PI, then no need for adjustment. */
        targetTheta =
          diffTheta < PI ? targetTheta : currentTheta + (TWO_PI - diffTheta);
      }
    }

    await this._camera_spring.start({
      from: {
        radius: this.radius,
        phi: this.polarAngle,
        theta: this.azimuthalAngle,
        from: this._roll,
      },
      to: {
        radius: radius ?? this.radius,
        phi: phi ?? this.polarAngle,
        theta: targetTheta ?? this.azimuthalAngle,
      },
      onChange: ({ value }) => {
        radius !== undefined && this.setRadius(value.radius as number);
        phi !== undefined && this.setPolarAngle(value.phi as number);
        theta !== undefined && this.setAzimuthalAngle(value.theta as number);
        this.updateCameraPosition();
        this.resetTarget();
      },
    });

    this.resetTarget();
    this.unlock();
    this._isAnimating = false;
  }

  async animateZoomTo(targetRadius: number, duration?: number, ease?: string) {
    if (this._isAnimating) return;

    this.lock();
    this._isAnimating = true;

    if (duration === undefined) {
      const diffRadius = Math.abs(this._spherical.radius - targetRadius);
      duration = Math.log(Math.max(diffRadius, 1)) / 5;
    }

    await gsap.to(this._spherical, {
      radius: targetRadius,
      duration: duration,
      ease: ease ?? 'power4.out',
      onUpdate: () => {
        if (this._spherical.radius < targetRadius) {
          console.log('diff: ', targetRadius - this._spherical.radius);
        }
        this.updateCameraPosition();
        this.resetTarget();
      },
    });

    this.resetTarget();
    this.unlock();
    this._isAnimating = false;
  }
  async animateZoomToSpring(targetRadius: number) {
    if (this._isAnimating) return;

    this.lock();
    this._isAnimating = true;

    await this._camera_spring.start({
      from: {
        radius: this.radius,
      },
      to: {
        radius: targetRadius,
      },
      onChange: ({ value }) => {
        const radius = value.radius as number;
        this.setRadius(radius);

        this.updateCameraPosition();
        this.resetTarget();
      },
    });

    this.resetTarget();
    this.unlock();
    this._isAnimating = false;
  }

  private _onPointerDown = (event: PointerEvent) => {
    const button = event.button;
    if (!this._domElement) return;
    event.preventDefault();

    this._domElement.setPointerCapture(event.pointerId);

    switch (button) {
      case 0: {
        this._domElement.addEventListener(
          'pointermove',
          this._onPointerMoveLeft
        );
        break;
      }
      case 1: {
        this._domElement.addEventListener(
          'pointermove',
          this._onPointerMoveMiddle
        );
        break;
      }
      case 2: {
        this._domElement.addEventListener(
          'pointermove',
          this._onPointerMoveRight
        );
        break;
      }
    }
  };

  private _onPointerUp = (event: PointerEvent) => {
    const button = event.button;
    if (!this._domElement) return;
    event.preventDefault();

    switch (button) {
      case 0: {
        this._domElement.removeEventListener(
          'pointermove',
          this._onPointerMoveLeft
        );
        break;
      }
      case 1: {
        this._domElement.removeEventListener(
          'pointermove',
          this._onPointerMoveMiddle
        );
        break;
      }
      case 2: {
        this._domElement.removeEventListener(
          'pointermove',
          this._onPointerMoveRight
        );
        event;
        event.stopPropagation();
        break;
      }
    }
  };

  private _onPointerMoveLeft = (event: PointerEvent) => {
    if (event.buttons % 2 === 0) {
      this._domElement?.removeEventListener(
        'pointermove',
        this._onPointerMoveLeft
      );
      return;
    }

    event.preventDefault();
    const deltaX = -event.movementX;
    const deltaY = -event.movementY;

    this.addRotation(deltaX, deltaY);
  };

  private _onPointerMoveMiddle = (event: PointerEvent) => {
    event.preventDefault();
    const deltaY = event.movementY / 50;
    this.addRadialZoom(deltaY);
  };

  private _onPointerMoveRight = (event: PointerEvent) => {
    event.preventDefault();
    const deltaY = event.movementY / 50;
    this.addRadialZoom(deltaY);
  };

  private _onPointerWheel = (event: WheelEvent) => {
    event.preventDefault();
    // deltaY will be between -100 and 100.
    const zoom = event.deltaY / 100;
    this.addRadialZoom(zoom);
  };

  private _onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  connectEventListeners() {
    if (!this._domElement) return;
    this._domElement.addEventListener('pointerdown', this._onPointerDown);
    this._domElement.addEventListener('pointerup', this._onPointerUp);
    this._domElement.addEventListener('wheel', this._onPointerWheel);
    this._domElement.addEventListener('contextmenu', this._onContextMenu);
  }

  disconnectEventListeners() {
    if (!this._domElement) return;
    this._domElement.removeEventListener('pointerdown', this._onPointerDown);
    this._domElement.removeEventListener('pointerup', this._onPointerUp);
    this._domElement.removeEventListener('wheel', this._onPointerWheel);
    this._domElement.removeEventListener('contextmenu', this._onContextMenu);

    this._domElement.removeEventListener(
      'pointermove',
      this._onPointerMoveLeft
    );

    this._domElement.removeEventListener(
      'pointermove',
      this._onPointerMoveMiddle
    );

    this._domElement.removeEventListener(
      'pointermove',
      this._onPointerMoveRight
    );
  }

  get domElement(): HTMLElement | null {
    return this._domElement;
  }

  set domElement(domElement: HTMLElement) {
    this.setDomElement(domElement);
  }

  setDomElement(domElement: HTMLElement) {
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
    radius: number = DEFAULT_RADIUS,
    azimuthalAngle: number = DEFAULT_AZIMUTH,
    polarAngle: number = DEFAULT_POLAR
  ) {
    super();
    this.add(this._pivotPoint);
    this._pivotPoint.add(this._offsetPoint);
    this._offsetPoint.add(this._attachPoint);
    this.name = 'camera-controller';
    this._pivotPoint.name = 'camera-pivot-point';
    this._offsetPoint.name = 'camera-offset-point';
    this._attachPoint.name = 'camera-attach-point';

    if (camera) {
      this._camera = camera;
      const parent = camera.parent;
      this._attachPoint.add(camera);
      if (parent) {
        parent.add(this);
      }
    }

    this.setRadiusTarget(radius);
    this.setRadius(radius);

    this.setAzimuthalAngleTarget(azimuthalAngle);
    this.setAzimuthalAngle(azimuthalAngle);

    this.setPolarAngleTarget(polarAngle);
    this.setPolarAngle(polarAngle);
  }

  /*  End of CameraController class. */
}
