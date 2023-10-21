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
import {
  Object3D,
  type PerspectiveCamera,
  Spherical,
  Vector3,
  Euler,
} from 'three';
import { clamp } from 'three/src/math/MathUtils';
import { smoothCritDamp } from './smoothing';
import { damp, dampAngle } from 'maath/easing';
import { gsap } from 'gsap';

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

const _eul1 = new Euler();
const _eul2 = new Euler();

function approxZero(num: number, epsilon = EPSILON) {
  return Math.abs(num) <= epsilon;
}

function approxEqual(num1: number, num2: number, epsilon: number = EPSILON) {
  return Math.abs(num1 - num2) <= epsilon;
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

  /**
   * @description Updates the camera. Should be called inside of the render loop each frame.
   * @author Ryan Milligan
   * @date Sep/09/2023
   * @param {number} deltaTime
   * @memberof CameraController
   */
  update(deltaTime: number) {
    // this._isMoving = false;
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
        console.log('REST');
      }
      this._isMoving = isMoving;
    }

    const pivotPoint = this._pivotPoint;
    const attachPoint = this._attachPoint;

    pivotPoint.rotation.set(0, 0, 0); // Reset rotations.
    attachPoint.position.set(0, 0, this._spherical.radius); // Set the position of the camera.
    this._camera?.position.set(0, 0, 0);

    const azimuthalAngle = this._spherical.theta;
    const polarAngle = this._spherical.phi;

    const yRot = azimuthalAngle;
    const xRot = -(PI_OVER_TWO - polarAngle);
    _eul1.set(xRot, yRot, 0, 'YXZ');

    // Rotations are intrinsic, so the order matters. Rotation around local
    // y-axis must be done first in order to preserve the local up-vector.
    pivotPoint.rotateY(azimuthalAngle); // Rotate around local y-axis.
    pivotPoint.rotateX(-(PI_OVER_TWO - polarAngle)); // Rotate around local
    // x-axis.

    this._camera?.updateProjectionMatrix();
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
    _v2.set(0, 0, 1);
    _v3.addVectors(_v1, _v2);

    // Look down the z-axis.
    this.up.copy(Y_AXIS);
    this.lookAt(_v3);
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

    // Set radius with distance to new target.
    const radius = _v3.length();
    this._setRadius(radius);
    this.setTargetRadius(radius);

    // Attach to the object.
    obj.add(this);
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

  resetTarget() {
    const { radius, phi, theta } = this._spherical;
    this._sphericalTarget.set(radius, phi, theta);
  }

  animateTo(to: { radius?: number; phi?: number; theta?: number }) {
    this.lock();
    this.resetTarget();
    const { radius, phi, theta } = to;
    if (
      typeof radius !== 'number' &&
      typeof phi !== 'number' &&
      typeof theta !== 'number'
    ) {
      this.unlock();
      this._isAnimating = false;
      return Promise.resolve();
    }

    // console.log(`anim radius: ${radius ?? 'undefined'}`);
    // console.log(`anim polar: ${polar ?? 'undefined'}`);
    // console.log(`anim azimuth: ${azimuth ?? 'undefined'}`);

    // this.setRadiusTarget(radius ?? this._spherical.radius);
    // this.setPolarAngleTarget(phi ?? this._spherical.phi);
    // this.setAzimuthalAngleTarget(theta ?? this._spherical.theta);

    const duration = 5;

    return new Promise<void>((resolve) => {
      this._isAnimating = true;
      gsap.to(this._spherical, {
        radius: radius ?? this._spherical.radius,
        phi: phi ?? this._spherical.phi,
        theta: theta ?? this._spherical.theta,
        duration: duration,
        onComplete: () => {
          this.unlock();
          this._isAnimating = false;

          this.resetTarget();
          resolve();
        },
      });
      gsap.to(this._sphericalTarget, {
        radius: radius ?? this._spherical.radius,
        phi: phi ?? this._spherical.phi,
        theta: theta ?? this._spherical.theta,
        duration: duration,
        onComplete: () => {
          this.resetTarget();
        },
      });
    });
  }

  animateSequence(
    animations: {
      target: gsap.TweenTarget;
      vars: gsap.TweenVars;
      position?: gsap.Position;
      onComplete?: () => void;
    }[]
  ) {
    if (animations.length < 1) return Promise.resolve();
    this.lock();
    const tl = gsap.timeline();

    // this._normalizeAzimuthalAngle();

    return new Promise<void>((resolve) => {
      this._isAnimating = true;
      for (let i = 0; i < animations.length; ++i) {
        const anim = animations[i];
        if (!anim) continue;
        const { target, vars, position } = anim;

        tl.to(
          target,
          {
            ...vars,
            onComplete:
              i === animations.length - 1
                ? () => {
                    this.unlock();
                    this._isAnimating = false;

                    this.setRadiusTarget(this._spherical.radius);
                    this.setPolarAngleTarget(this._spherical.phi);
                    this.setAzimuthalAngleTarget(this._spherical.theta);

                    anim.onComplete && anim.onComplete();
                    resolve();
                  }
                : anim.onComplete,
          },
          position
        );
      }
    });
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

    this.setRadiusTarget(radius);
    this.setRadius(radius);

    this.setAzimuthalAngleTarget(azimuthalAngle);
    this.setAzimuthalAngle(azimuthalAngle);

    this.setPolarAngleTarget(polarAngle);
    this.setPolarAngle(polarAngle);
  }

  /*  End of CameraController class. */
}
