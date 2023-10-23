import { KeplerBody } from '@/components/canvas/body/kepler-body';
import { type CameraController } from '@/components/canvas/scene/camera-controller/CameraController';
import {
  DIST_MULT,
  METER,
  PI,
  PI_OVER_TWO,
  SIMULATION_RADIUS,
  SUN_RADIUS,
  TWO_PI,
} from '@/constants/constants';
import { NEAR_CLIP, SURFACE_NEAR_CLIP } from '@/constants/scene-constants';
import { getLocalUpInWorldCoords } from '@/helpers/vector-utils';
import { type RootState } from '@react-three/fiber';
import { type XRState } from '@react-three/xr';
import {
  type Object3D,
  type PerspectiveCamera,
  Vector3,
  Spherical,
} from 'three';
import { degToRad, radToDeg } from 'three/src/math/MathUtils';
import { assign, createMachine } from 'xstate';
import { gsap } from 'gsap';
import { normalizeAngle } from '@/helpers/rotation-utils';

const _observerUp = new Vector3();
const _focusUp = new Vector3();
const _cameraUp = new Vector3();

const _observerPos = new Vector3();
const _cameraPos = new Vector3();
const _controllerPos = new Vector3();
const _focusPos = new Vector3();
const _spherical = new Spherical();

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

const NEPTUNE_APOAPSIS = 4553758200000 * METER;

// Space view constants:
const SPACE_MAX_DIST = SIMULATION_RADIUS - NEPTUNE_APOAPSIS;
const SPACE_MIN_DIST_FROM_SURFACE = 1e-3;

// Surface view constants:
const SURFACE_MIN_DIST = METER * 1e-1;
const SURFACE_MAX_DIST = 1.5 * SURFACE_MIN_DIST;

// Default FOV.
const FOV = 40;

type Context = {
  getThree: () => RootState;
  getXR: () => XRState;
  controls: CameraController | null;
  mainCamera: PerspectiveCamera | null;
  focusTarget: Object3D | null;
  observer: Object3D | null;
  vrHud: Object3D | null;
};

type Events =
  | { type: 'TO_SURFACE' }
  | { type: 'TO_SPACE' }
  | { type: 'UPDATE'; deltaTime: number }
  | { type: 'ASSIGN_GET_THREE'; getThree: () => RootState }
  | { type: 'START_XR_SESSION' }
  | { type: 'END_XR_SESSION' }
  | { type: 'ASSIGN_CONTROLS'; controls: CameraController }
  | { type: 'ASSIGN_CAMERA'; camera: PerspectiveCamera }
  | { type: 'ASSIGN_OBSERVER'; observer: Object3D | null }
  | { type: 'ASSIGN_VR_HUD'; vrHud: Object3D }
  | { type: 'SET_TARGET'; focusTarget: Object3D | null }
  | { type: 'ROTATE_AZIMUTHAL'; deltaAngle: number }
  | { type: 'ROTATE_POLAR'; deltaAngle: number }
  | { type: 'ZOOM'; deltaZoom: number }
  | { type: 'RESET_REF_SPACE' }
  | { type: 'HIDE_VR_HUD' }
  | { type: 'SHOW_VR_HUD' }
  | { type: 'LOCK_CONTROLS' }
  | { type: 'UNLOCK_CONTROLS' };

export const cameraMachine = createMachine(
  {
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./camera-machine.typegen').Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    id: 'camera-machine',
    // Initial context:
    context: () => ({
      controls: null,
      getThree: null!,
      getXR: null!,
      mainCamera: null,
      observer: null,
      focusTarget: null,
      vrHud: null,
    }),

    // Context assignment events:
    on: {
      ASSIGN_GET_THREE: {
        actions: ['logEvent', 'assignGetThree', 'initializeControls'],
      },

      ASSIGN_CONTROLS: {
        cond: (context, event) => {
          return context.controls !== event.controls;
        },
        actions: [
          // 'logEvent',
          'assignControls',
          'initializeControls',
        ],
      },
      ASSIGN_CAMERA: {
        actions: [
          assign({ mainCamera: (_, event) => event.camera }),
          // 'logEvent',
          'setCamera',
          'initializeControls',
        ],
      },
      ASSIGN_OBSERVER: {
        cond: (context, event) => {
          return context.observer !== event.observer;
        },
        actions: [
          assign({ observer: (_, event) => event.observer }),
          // 'logEvent',
        ],
      },

      ASSIGN_VR_HUD: {
        actions: [
          // 'logEvent',
          assign({
            vrHud: (_, { vrHud }) => vrHud,
          }),
          'initializeControls',
        ],
      },
      ROTATE_AZIMUTHAL: {
        actions: ['rotateAzimuthal'],
      },

      ROTATE_POLAR: {
        actions: ['rotatePolar'],
      },

      ZOOM: {
        actions: ['addRadialZoom'],
      },

      END_XR_SESSION: {
        actions: ['logEvent', 'endXRSession'],
      },
      SHOW_VR_HUD: {
        actions: ['logEvent', 'showVRHud'],
      },
      HIDE_VR_HUD: {
        actions: ['logEvent', 'hideVRHud'],
      },
      LOCK_CONTROLS: {
        actions: ['logEvent', ({ controls }) => controls?.lock()],
      },
      UNLOCK_CONTROLS: {
        actions: ['logEvent', ({ controls }) => controls?.unlock()],
      },
    },

    initial: 'space', // Start in 'space' view-mode.

    states: {
      space: {
        entry: ['applySpaceCamUp', 'setSpaceCamDistance'],
        // Cleanup on exit:
        exit: (context) => {
          const { controls, observer } = context;
          if (!controls || !observer) return;
        },
        on: {
          // UPDATE event.
          UPDATE: {
            actions: ['updateCamera'],
          },
          SET_TARGET: {
            internal: true,
            actions: ['assignTarget', 'attachToTarget', 'setSpaceCamDistance'],
          },
          TO_SURFACE: {
            // Transition to 'surface' view-mode:
            target: 'entering_surface',

            actions: ['logEvent'],
          },
          ASSIGN_CONTROLS: {
            cond: (context, event) => {
              return context.controls !== event.controls;
            },
            actions: [
              'logEvent',
              'assignControls',
              'setSpaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'startXRSession',
              // 'setSpaceCamDistance',
              // 'showVRHud',
            ],
          },
        },
      },
      entering_surface: {
        on: {
          UPDATE: {
            actions: ['updateCamera'],
          },
        },
        invoke: {
          src: (context) =>
            new Promise<void>((resolve) => {
              const { controls, focusTarget, observer } = context;
              if (
                !controls ||
                !controls.camera ||
                !observer ||
                !focusTarget ||
                !(focusTarget instanceof KeplerBody)
              ) {
                return resolve();
              }

              const bodyMesh = focusTarget.meshRef.current;
              if (!bodyMesh) return;

              /* Get angle between up vector of controller and up vector of body. */
              _v1.set(...getLocalUpInWorldCoords(controls));
              _v2.set(...getLocalUpInWorldCoords(bodyMesh));
              const angle = controls.rotation.x - _v1.angleTo(_v2);

              /* Animate alignment of controller with equator/ polar axis. */
              gsap.to(controls.rotation, {
                // x: -obliquity,
                x: angle,
                // z: 0,
                duration: 0.5,
                onComplete: () => {
                  observer.getWorldPosition(_observerPos);

                  /* Get Observer position in controller local space. */
                  controls.worldToLocal(_observerPos);

                  const observerRadius = _observerPos.length();

                  /* Get spherical coordinates of observer position. */
                  _spherical.setFromVector3(_observerPos);
                  _spherical.makeSafe();

                  /* Normalize azimuthal angles so that the rotation will take the shortest path. */
                  controls.normalizeAzimuthalAngle();
                  const currentTheta = controls.azimuthalAngle;
                  const phi = _spherical.phi;
                  const targetTheta = normalizeAngle(_spherical.theta);
                  // const diffTheta = ( targetTheta - currentTheta + PI) % TWO_PI;
                  let diffTheta = 0;
                  let theta = 0;

                  // console.log(`Current theta: ${radToDeg(currentTheta)}`);
                  // console.log(`Target theta: ${radToDeg(targetTheta)}`);

                  /* Determine shortest angle path to target. */
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
                    theta =
                      diffTheta < PI
                        ? targetTheta
                        : currentTheta + (diffTheta - TWO_PI);
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
                    theta =
                      diffTheta < PI
                        ? targetTheta
                        : currentTheta + (TWO_PI - diffTheta);
                  }

                  // console.log(`diffTheta: ${radToDeg(diffTheta)}`);
                  // console.log(`shortest path theta: ${radToDeg(theta)}`);

                  const targetRadius = observerRadius * 3;

                  const dist = Math.min(controls.radius, targetRadius);

                  /* Set controller targets to current values. */
                  controls.resetTarget();

                  void controls
                    .animateSequence([
                      {
                        /* Animate camera to be over observer position. */
                        target: controls.spherical,
                        vars: {
                          radius: dist,
                          phi: phi,
                          /* Ensure camera takes shortest path. */
                          theta: theta,
                          // Math.abs(diffTheta) < PI ? theta : theta - TWO_PI,
                          duration: 1,
                        },
                        // position: '-=100%',
                        onComplete: () => {
                          // const theta = radToDeg(controls.azimuthalAngle);
                          // console.log(`Theta: ${theta}`);
                          controls.attachToWithoutMoving(observer);
                          _observerUp.set(...getLocalUpInWorldCoords(observer));
                          controls.up.copy(_observerUp);
                          controls.camera.up.copy(controls.up);

                          controls.setAzimuthalAngle(PI_OVER_TWO);
                          controls.setPolarAngle(0);
                          controls.setPolarAngleTarget(0);

                          controls.resetTarget();
                        },
                      },
                      {
                        /* Zoom in to surface. */
                        target: controls.spherical,
                        vars: { radius: SURFACE_MIN_DIST, duration: 1 },
                        // position: '-=1',
                      },
                      {
                        /* Rotate camera to be parallel with surface. */
                        target: controls.spherical,
                        vars: { phi: PI_OVER_TWO, duration: 1 },
                        position: '-=50%',
                      },
                    ])
                    .then(() => {
                      console.log('Surface Anim Resolving!');
                      resolve();
                    });
                },
              });
            }),
          id: 'entering_surface_promise',
          onDone: { target: 'surface' },
        },
      },
      surface: {
        entry: [
          'enterSurfaceView',
          'applySurfaceCamUp',
          'setSurfaceCamDistance',
          'attachToObserver',
        ],
        // Cleanup on exit:
        exit: ['logEvent', 'attachToTarget'],
        on: {
          // UPDATE event:
          UPDATE: {
            internal: true,
            actions: ['updateCamera', 'updateSurfaceView', 'applySurfaceCamUp'],
          },
          SET_TARGET: {
            internal: true,
            actions: [
              'logEvent',
              'assignTarget',
              'applySurfaceCamUp',
              'setSurfaceCamDistance',
            ],
          },
          TO_SPACE: {
            // Transition to 'space' view-mode:
            target: 'space',
            actions: ['logEvent'],
          },
          ASSIGN_CONTROLS: {
            cond: (context, event) => {
              return context.controls !== event.controls;
            },
            actions: [
              'logEvent',
              'assignControls',
              'setSurfaceCamDistance',
              'initializeControls',
            ],
          },
          START_XR_SESSION: {
            actions: [
              'logEvent',
              'startXRSession',
              'setSurfaceCamDistance',
              // 'showVRHud',
            ],
          },
        },
      },
    },
  },
  {
    // Action implementations:
    actions: {
      // logEvent: log((_, event) => event),
      logEvent: () => {
        return;
      },

      assignGetThree: assign({
        getThree: (_, { getThree }) => getThree,
      }),
      assignControls: assign({
        controls: (_, event) => {
          return event.controls;
        },
      }),
      assignTarget: assign({
        // Set new focus target.
        focusTarget: (_, event) => {
          return event.focusTarget;
        },
      }),
      setCamera(context, event) {
        const { controls } = context;
        const { camera } = event;
        controls?.setCamera(camera);
      },
      initializeControls: (context) => {
        const { controls, mainCamera, getThree, vrHud } = context;
        if (!controls) return;

        if (mainCamera) {
          controls.setCamera(mainCamera);
          mainCamera.fov = FOV;
        }

        if (getThree) {
          // Get canvas from store.
          const canvas = getThree().gl.domElement;
          if (canvas && !controls.domElement) {
            // Pass canvas to controls for setting up event listeners.
            controls.setDomElement(canvas);
          }
        }

        if (vrHud) {
          // Attach vrHud to controls.
          controls.attachToController(vrHud);
        }
      },
      startXRSession: (context) => {
        const { getThree, controls, vrHud } = context;
        if (!controls) {
          console.error('error initializing xr session. Controls are null.');
          return;
        }

        const { xr } = getThree().gl;

        // XR camera may not be set yet, so set timeout.
        setTimeout(() => {
          const xrCamera = xr.getCamera();
          if (xrCamera && xrCamera.name !== 'xr-camera') {
            xrCamera.name = 'xr-camera';
            const [xrCam1, xrCam2] = xrCamera.cameras;
            xrCam1.name = 'xrCam1';
            xrCam2.name = 'xrCam2';
          }
        }, 100);

        // Position vrHud.
        if (vrHud) {
        }
      },
      endXRSession: (context) => {
        const { vrHud, controls, mainCamera, getThree } = context;
        if (vrHud) {
        }

        const { gl } = getThree();
        const xrCamera = gl.xr.getCamera();

        if (mainCamera) {
          // Need to reset the FOV because it gets messed up for some reason.
          mainCamera.rotation.set(0, 0, 0);
          mainCamera.fov = FOV;
        }
        if (xrCamera) {
          controls?.attachToController(xrCamera);
          xrCamera.rotation.set(0, 0, 0);
        }
      },

      attachToTarget: (context) => {
        const { controls, focusTarget } = context;
        if (!focusTarget || !controls) return;
        // controls.attachControllerTo(focusTarget);
        controls.attachToWithoutMoving(focusTarget);
        controls.applyWorldUp();
      },
      attachToObserver: (context) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
        // controls.attachControllerTo(observer);
        _observerUp.set(...getLocalUpInWorldCoords(observer));
        controls.up.copy(_observerUp);

        controls.camera.up.copy(controls.up);
      },

      updateCamera: (context, event) => {
        const { controls } = context;

        if (!controls) {
          return;
        }
        controls.update(event.deltaTime);
      },

      enterSurfaceView: (context) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;

        // Set polar angle to be horizontal relative to the surface.
        // controls.setPolarAngleTarget(0);
        // setTimeout(() => {
        //   controls.setPolarAngleTarget(PI_OVER_TWO);
        // }, 1000);
      },

      updateSurfaceView: (context) => {
        const { controls, observer } = context;
        if (!controls || !observer) return;
      },

      applySurfaceCamUp: (context) => {
        const { controls, observer, focusTarget } = context;
        if (!controls || !observer || !focusTarget) return;
        // controls.rotation.set(0, 0, 0); // Reset rotation.
      },
      applySpaceCamUp: (context) => {
        // Reset up vector of camera.
        const { controls } = context;
        if (!controls) return;
        controls.applyWorldUp();
      },
      setSpaceCamDistance: (context) => {
        const { controls, focusTarget } = context;
        if (!controls) return;

        controls.maxDistance = SPACE_MAX_DIST;
        // controls.maxDistance = Infinity;
        if (!focusTarget) {
          controls.minDistance =
            SPACE_MIN_DIST_FROM_SURFACE + SUN_RADIUS / DIST_MULT;
          return;
        }
        // Type guard.
        if (!(focusTarget instanceof KeplerBody)) {
          console.error('error! focusTarget is not a KeplerBody');
          return;
        }

        if (!focusTarget || !controls) return;
        const meanRadius = focusTarget.meanRadius;

        // Set min distance relative to focus targets radius.
        controls.minDistance = SPACE_MIN_DIST_FROM_SURFACE + meanRadius;
        controls.camera.near = NEAR_CLIP;

        const radius = focusTarget.meanRadius * 5;
        controls.radius < radius && controls.setTargetRadius(radius);
      },
      setSurfaceCamDistance: (context) => {
        const { controls } = context;
        if (!controls || !controls?.camera) return;
        controls.minDistance = SURFACE_MIN_DIST;
        controls.maxDistance = SURFACE_MAX_DIST;

        controls.camera.near = SURFACE_NEAR_CLIP;
      },
      rotateAzimuthal: ({ controls }, event) => {
        if (!controls) return;
        controls.addAzimuthalRotation(event.deltaAngle);
      },
      rotatePolar: ({ controls }, event) => {
        if (!controls) return;
        controls.addPolarRotation(event.deltaAngle);
      },
      addRadialZoom: ({ controls }, event) => {
        if (!controls) return;
        controls.addRadialZoom(event.deltaZoom);
      },
      showVRHud: (context) => {
        const { vrHud } = context;
        if (!vrHud) return;
        vrHud.visible = true;
      },
      hideVRHud: (context) => {
        const { vrHud } = context;
        if (!vrHud) return;
        vrHud.visible = false;
      },
    },
  }
);
