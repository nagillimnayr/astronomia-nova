import { Group, Object3D, PerspectiveCamera, Vector3 } from 'three';
import { damp, degToRad, clamp } from 'three/src/math/MathUtils';
import { TWO_PI, PI_OVER_TWO, PI } from '@/simulation/utils/constants';

const X_AXIS: Readonly<Vector3> = new Vector3(1, 0, 0);
const Y_AXIS: Readonly<Vector3> = new Vector3(0, 1, 0);

const MIN_RADIUS_BOUND = Number.EPSILON;
const MAX_RADIUS_BOUND = Infinity;

const MIN_POLAR_ANGLE_BOUND = Number.EPSILON;
const MAX_POLAR_ANGLE_BOUND = PI - Number.EPSILON;

const MIN_AZIMUTHAL_ANGLE_BOUND = 0;
const MAX_AZIMUTHAL_ANGLE_BOUND = TWO_PI;

function approxZero(num: number, epsilon = 1e-15) {
  return Math.abs(num) <= epsilon;
}

const lambda = 0.15;

export class CameraController extends Object3D {
  private _camera: PerspectiveCamera | null = null;
  private _domElement: HTMLElement | null = null;
  private _needsUpdate = false;

  private _radius = 1e2;
  private _minRadius = MIN_RADIUS_BOUND;
  private _maxRadius = 1e10;
  private _deltaRadius = 0;
  private _zoomSpeed = 5;
  private _zoomFactor = 1e-1;

  private _polarAngle = MIN_POLAR_ANGLE_BOUND;
  private _minPolarAngle = MIN_POLAR_ANGLE_BOUND;
  private _maxPolarAngle = MAX_POLAR_ANGLE_BOUND;
  private _deltaPolarAngle = 0;

  private _azimuthalAngle = 0;
  private _minAzimuthalAngle = -Infinity;
  private _maxAzimuthalAngle = Infinity;
  private _deltaAzimuthalAngle = 0;

  private _rotateSpeed = 1;

  private _mouseDown = false;

  constructor(camera?: PerspectiveCamera) {
    super();
    if (camera) {
      this._camera = camera;
      const parent = camera.parent;
      this.add(camera);
      if (parent) {
        parent.add(this);
      }
    }
  }

  update(deltaTime: number, force = false) {
    // if (!this._needsUpdate && !force) return;
    this.updateRadius(deltaTime);
    this.updatePolarAngle(deltaTime);
    this.updateAzimuthalAngle(deltaTime);

    this.rotation.set(0, 0, 0); // Reset rotations.
    this._camera?.position.set(0, 0, this._radius); // Set position of camera.

    // Rotations are intrinsic, so the order matters. Rotation around local y-axis must be done first in order to preserve the local up-vector.
    this.rotateY(this._azimuthalAngle); // Rotate around local y-axis.
    this.rotateX(PI_OVER_TWO - this._polarAngle); // Rotate around local x-axis.

    this._camera?.updateProjectionMatrix();
    this._needsUpdate = false;
  }

  private updateAzimuthalAngle(deltaTime: number) {
    const newAzimuthalAngle = damp(
      this._azimuthalAngle,
      this._azimuthalAngle + this._deltaAzimuthalAngle,
      lambda,
      deltaTime
    );
    this.setAzimuthalAngle(newAzimuthalAngle);
    this._deltaAzimuthalAngle = 0;
  }
  private updatePolarAngle(deltaTime: number) {
    const newPolarAngle = damp(
      this._polarAngle,
      this._polarAngle + this._deltaPolarAngle,
      lambda,
      deltaTime
    );
    this.setPolarAngle(newPolarAngle);
    this._deltaPolarAngle = 0;
  }
  private updateRadius(deltaTime: number) {
    const newRadius = damp(
      this._radius,
      this._radius + this._deltaRadius,
      lambda,
      deltaTime
    );
    this.setRadius(newRadius);
    this._deltaRadius = 0;
  }

  setRadius(radius: number) {
    // Adjust to be within min/max range.
    this._radius = clamp(radius, this._minRadius, this._maxRadius);
    this._needsUpdate = true;
  }
  addRadialZoom(zoom: number) {
    if (approxZero(zoom)) return;
    // this._deltaRadius +=
    //   zoom * this._zoomSpeed * (this._radius / this._zoomFactor);
    this._deltaRadius +=
      zoom * this._zoomSpeed * (this._radius * this._zoomFactor);
    this._needsUpdate = true;
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
    this._needsUpdate = true;
  }
  addPolarRotation(polarRotation: number) {
    // if (approxZero(polarRotation)) return;
    this._deltaPolarAngle += polarRotation * this._rotateSpeed;
    this._needsUpdate = true;
  }

  setAzimuthalAngle(azimuthalAngle: number) {
    // Adjust angle to be within range [0, TWO_PI]
    let adjustedAngle = azimuthalAngle;
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
    this._needsUpdate = true;
  }

  addAzimuthalRotation(azimuthalRotation: number) {
    // if (approxZero(azimuthalRotation)) return;
    this._deltaAzimuthalAngle += azimuthalRotation * this._rotateSpeed;
    this._needsUpdate = true;
  }

  addRotation(azimuthalRotation: number, polarRotation: number) {
    this.addAzimuthalRotation(azimuthalRotation);
    this.addPolarRotation(polarRotation);
  }

  setCamera(camera: PerspectiveCamera) {
    this._camera = camera;
    const parent = camera.parent;
    this.add(camera);
    if (parent && parent !== this) {
      parent.add(this);
    }
  }
  set camera(camera: PerspectiveCamera) {
    this.setCamera(camera);
  }
  get camera() {
    return this._camera!;
  }

  get minRadius() {
    return this._minRadius;
  }
  set minRadius(minRadius: number) {
    this.setMinRadius(minRadius);
  }
  setMinRadius(minRadius: number) {
    this._minRadius = clamp(minRadius, MIN_RADIUS_BOUND, this._maxRadius);
    this.setRadius(this._radius); // Clamp radius.
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
    this.setRadius(this._radius); // Clamp radius.
  }
  get maxDistance() {
    return this._maxRadius;
  }
  set maxDistance(maxDistance: number) {
    this.setMinRadius(maxDistance);
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

  private _onMouseDown(event: MouseEvent) {
    console.log('mouse down', this);
    if (!this._domElement) return;
    this._mouseDown = true;
    this._domElement.addEventListener('mousemove', this.onMouseMove);
  }
  onMouseDown = this._onMouseDown.bind(this);

  private _onMouseUp(event: MouseEvent) {
    console.log('mouse up', this);
    if (!this._domElement) return;
    this._mouseDown = false;
    this._domElement.removeEventListener('mousemove', this.onMouseMove);
  }
  onMouseUp = this._onMouseUp.bind(this);

  private _onMouseMove(event: MouseEvent) {
    if (!this._mouseDown) return;
    event.preventDefault();
    const deltaX = -event.movementX;
    const deltaY = event.movementY;

    this.addRotation(deltaX, deltaY);
  }
  onMouseMove = this._onMouseMove.bind(this);

  private _onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    const deltaZoom = event.deltaY;
    this.addRadialZoom(deltaZoom);
  }
  onMouseWheel = this._onMouseWheel.bind(this);

  // private onGamepadConnected: (event: GamepadEvent)=>void = (event) => {
  //   const gamepad = event.gamepad;

  // }

  connectEventListeners() {
    if (!this._domElement) return;
    this._domElement.addEventListener('mousedown', this.onMouseDown);
    this._domElement.addEventListener('mouseup', this.onMouseUp);
    this._domElement.addEventListener('wheel', this.onMouseWheel);

    // if (window !== undefined) {
    //     window.addEventListener('gamepadconnected', )
    //   }
  }
  disconnectEventListeners() {
    if (!this._domElement) return;
    this._domElement.removeEventListener('mousedown', this.onMouseDown);
    this._domElement.removeEventListener('mouseup', this.onMouseUp);
    this._domElement.removeEventListener('wheel', this.onMouseWheel);
    if (this._mouseDown) {
      this._domElement.removeEventListener('mousemove', this.onMouseMove);
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
